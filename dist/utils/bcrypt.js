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
exports.hashPasswordUsingBcrypt = exports.comparePasswords = void 0;
const bcrypt = require("bcrypt");
const hashPasswordUsingBcrypt = (plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        const hash = yield bcrypt.hash(plainPassword, saltRounds);
        return hash;
    }
    catch (err) {
        console.error("Error hashing password:", err);
    }
});
exports.hashPasswordUsingBcrypt = hashPasswordUsingBcrypt;
const comparePasswords = (inputPassword, hashedPasswordFromDB) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bcrypt.compare(inputPassword, hashedPasswordFromDB);
        console.log("result", result);
        return result;
    }
    catch (err) {
        console.error("Error comparing passwords:", err);
    }
});
exports.comparePasswords = comparePasswords;
