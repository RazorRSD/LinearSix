/**
 * This method will return the number of complete days between any pair of JS Date objects
 *
 * @param {Date} date1 - first date
 * @param {Date} date2 - second date
 * @return {number} number of days between two dates
 *
 * @example
 * const numOfDays = daysTo(date1, date2);
 */

const daysTo = (date1, date2) => {
  const firstDate = date1.getTime();
  const secondDate = date2.getTime();

  const diff = Math.abs(firstDate - secondDate);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
};

Date.prototype.daysTo = daysTo;

// =======================================================================================

const d1 = new Date(2024, 4, 6);
const d2 = new Date(Date.now());

const f = new Date();

console.log(f.daysTo(d1, d2));
