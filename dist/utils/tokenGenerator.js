"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const dotEnv = require("dotenv");
dotEnv.config();
const jwt = require("jsonwebtoken");
const generateAccessToken = (body) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(body, accessTokenSecret, { expiresIn: "12 h" });
    return token;
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (body) => {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const token = jwt.sign(body, refreshTokenSecret, { expiresIn: "1y" });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
