"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose = require("mongoose");
const connectDB = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbConnectionString = process.env.DB_CONNECTION_STRING;
        if (dbConnectionString) {
            const client = yield mongoose.connect(dbConnectionString);
            if (client) {
                console.log("Database connected successfully");
                callback();
            }
            else {
                console.log("Database url is not provided");
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.connectDB = connectDB;
