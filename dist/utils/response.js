"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, message, result = null) => {
    let response = {
        status: status,
        success: status < 400,
        message: status >= 400
            ? "Internal server error"
            : "Successfully completed operations",
        data: status < 400 ? result : null,
        error: status >= 400 ? result : undefined,
    };
    if (message) {
        response.message = message;
    }
    res.status(status).send(response);
};
exports.sendResponse = sendResponse;
