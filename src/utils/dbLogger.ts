const path = require("path");
const fs = require("fs");
const moment = require("moment");
export const databaseLogger = (message: string) => {
  let time = moment().format("LLL");
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "server",
    "apiLogger.log"
  );
  fs.appendFileSync(
    filePath,
    message + "  ( Time -> " + time + ")" + "\n" + "\n"
  );
};
