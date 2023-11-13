"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendValidationError = void 0;
const responseMessage_1 = require("../constant/responseMessage");
const statusCode_1 = require("../constant/statusCode");
const response_1 = require("./response");
const sendValidationError = (res, validation) => {
    const error = {};
    validation.forEach((ele) => {
        const property = ele.path;
        error[property] = ele.msg;
    });
    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, responseMessage_1.RESPONSE_MESSAGE.UNPROCESSABLE_ENTITY, error);
};
exports.sendValidationError = sendValidationError;
module.exports = { sendValidationError: exports.sendValidationError };
