"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStudentOrAdmin = exports.isStudentOrInstructor = exports.tokenAuthorization = exports.isStudent = exports.isInstructor = exports.isAdmin = void 0;
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
const responseMessage_1 = require("../constant/responseMessage");
const statusCode_1 = require("../constant/statusCode");
const user_1 = require("../constant/user");
const response_1 = require("../utils/response");
const tokenAuthorization = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate) {
            req.user = validate;
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.tokenAuthorization = tokenAuthorization;
const isAdmin = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate.rank === user_1.userType.admin) {
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.isAdmin = isAdmin;
const isStudent = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate.rank === user_1.userType.student) {
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.isStudent = isStudent;
const isInstructor = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate.rank === user_1.userType.instructor) {
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.isInstructor = isInstructor;
const isStudentOrInstructor = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate.rank === user_1.userType.instructor || user_1.userType.student) {
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.isStudentOrInstructor = isStudentOrInstructor;
const isStudentOrAdmin = (req, res, next) => {
    try {
        console.log("hello");
        const { accessToken } = req.cookies;
        console.log({ accessToken });
        if (!accessToken) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        if (validate.rank === user_1.userType.admin || user_1.userType.student) {
            next();
        }
        else {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
        }
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
    }
};
exports.isStudentOrAdmin = isStudentOrAdmin;
