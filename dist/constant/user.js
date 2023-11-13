"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicURL = exports.userType = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.userType = {
    admin: 1,
    instructor: 2,
    student: 3,
};
exports.publicURL = process.env.PUBLIC_URL;
