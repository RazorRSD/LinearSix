const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Returns an array of busy intervals for given time period.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} calendarId calender id you wanna take events from
 * @param {string} startingMoment starting moment
 * @param {string} endingMoment ending moment
 */
async function getBusyIntervals(
  auth,
  calendarId,
  startingMoment,
  endingMoment
) {
  try {
    const sm = new Date(startingMoment);
    const em = new Date(endingMoment);

    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: calendarId,
      timeMin: sm.toISOString(),
      timeMax: em.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;

    if (!events || events.length === 0) {
      console.log("No busy intervals found!");
    }

    const intervals = events.map((e, i) => {
      const start = e.start.date || e.start.dateTime;
      const end = e.end.date || e.end.dateTime;

      return { start, end };
    });

    console.log(intervals);
  } catch (e) {
    console.log("");
  }
}

/**
 * Returns an array of free intervals for given time period.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} calendarId calender id you wanna take events from
 * @param {string} startingMoment starting moment
 * @param {string} endingMoment ending moment
 */
async function getFreeIntervals(
  auth,
  calendarId,
  startingMoment,
  endingMoment
) {
  try {
    const sm = new Date(startingMoment);
    const em = new Date(endingMoment);

    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: calendarId,
      timeMin: sm.toISOString(),
      timeMax: em.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;

    if (!events || events.length === 0) {
      console.log("Whole period is free of events!");
    }

    let tempKeepEnd = null;

    let intervals = [];
    events.map((e, i) => {
      if (i === 0) {
        const start = sm.toISOString();
        const end = e.start.date || e.start.dateTime;
        tempKeepEnd = e.end.date || e.end.dateTime;
        intervals.push({ start, end });
      } else if (i + 1 < events.length) {
        const start = tempKeepEnd;
        const end = e.start.date || e.start.dateTime;
        tempKeepEnd = e.end.date || e.end.dateTime;
        intervals.push({ start, end });
      } else {
        const start = tempKeepEnd;
        const end = e.start.date || e.start.dateTime;
        tempKeepEnd = null;
        intervals.push({ start, end });
        intervals.push({
          start: e.end.date || e.end.dateTime,
          end: em.toISOString(),
        });
      }
    });

    console.log(intervals);
  } catch (e) {
    console.log("There was an Error processing the data");
  }
}

module.exports = { authorize, getBusyIntervals, getFreeIntervals };
