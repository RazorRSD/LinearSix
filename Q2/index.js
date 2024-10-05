const {
  authorize,
  getBusyIntervals,
  getFreeIntervals,
} = require("./src/googleFunc");
const { createInterface } = require("node:readline");

/**
 * Main function getting data from user input and execute the corresponding function
 */
function main() {
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  reader.question(
    `Please enter calender id(public or auth account owners')   : `,
    (id) => {
      reader.question(`Please enter starting moment  : `, (sm) => {
        reader.question(`Please enter ending moment  : `, (em) => {
          reader.question(
            `Please enter type of intervals, Free/Busy (F/B)  : `,
            (ty) => {
              authorize()
                .then((auth) => {
                  if (ty.toLowerCase() === "free" || ty.toLowerCase() === "f") {
                    getFreeIntervals(auth, id, sm, em)
                      .then((a) => {
                        reader.close();
                      })
                      .catch(() => {
                        console.log(
                          "Data Error: Please check your inputs and rerun"
                        );
                        reader.close();
                      });
                  } else if (
                    ty.toLowerCase() === "busy" ||
                    ty.toLowerCase() === "b"
                  ) {
                    getBusyIntervals(auth, id, sm, em)
                      .then((a) => {
                        reader.close();
                      })
                      .catch(() => {
                        console.log(
                          "Data Error: Please check your inputs and rerun"
                        );
                        reader.close();
                      });
                  } else {
                    console.log("Type not valid");
                    reader.close();
                    main();
                  }
                })
                .catch(() => {
                  console.log("Auth Error");
                  reader.close();
                });
            }
          );
        });
      });
    }
  );
}

main();
