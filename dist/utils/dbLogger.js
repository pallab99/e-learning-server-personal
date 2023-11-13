"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseLogger = void 0;
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const databaseLogger = (message) => {
    let time = moment().format("LLL");
    const filePath = path.join(__dirname, "..", "..", "src", "server", "apiLogger.log");
    fs.appendFileSync(filePath, message + "  ( Time -> " + time + ")" + "\n" + "\n");
};
exports.databaseLogger = databaseLogger;
