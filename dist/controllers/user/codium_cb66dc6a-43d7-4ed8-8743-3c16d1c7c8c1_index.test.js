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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const user_1 = require("../../constant/user");
const generateFileName_1 = require("../../helper/generateFileName");
const auth_1 = __importDefault(require("../../services/auth"));
const user_2 = __importDefault(require("../../services/user"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const sendValidationError_1 = require("../../utils/sendValidationError");
const path = require("path");
const fs = require("fs");
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
class UserControllerClass {
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const result = yield user_2.default.getAllUser();
                if (result.length <= 0) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                // const userData = await UserService.getDpOfAllUser(result);
                if (!result.length) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, result);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { user } = req;
                const userDetails = yield user_2.default.findByEmail(user.email);
                if (!userDetails) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, userDetails);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateDp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email } = req.user;
                const file = req.file;
                if (!req.file) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPLOAD_FAILED);
                }
                console.log(req.file);
                const user = yield user_2.default.findByEmail(email);
                if (!user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const S3_Bucket_path = `user/dp`;
                const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, email, file.originalname);
                console.log(fileName, user_1.publicURL);
                const saveFileOnServer = yield user_2.default.saveDpOnServer(file, fileName, user.email);
                if (saveFileOnServer.success) {
                    user.dp = user_1.publicURL + fileName;
                    yield user.save();
                }
                if (user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.DP_UPDATED, user);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { userId } = req.params;
                const userInUser = yield user_2.default.findById(userId);
                if (!userInUser.success && userInUser.data === null) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const data = userInUser === null || userInUser === void 0 ? void 0 : userInUser.data;
                if (data) {
                    const { email } = data;
                    const userInAuth = yield auth_1.default.findByEmail(email);
                    console.log({ userInAuth });
                    if (!userInAuth) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                    }
                    userInAuth.disabled = true;
                    const result = yield auth_1.default.save(userInAuth);
                    if (result) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.USER_DISABLED, userInAuth);
                    }
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const result = yield auth_1.default.getAllInstructor();
                if (!result.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, result.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                // const { name, phoneNumber, notificationSetting } = req.body;
                const { email } = req.user;
                const updatedDoc = yield user_2.default.updateUser(email, req.body);
                if (!updatedDoc.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPDATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.UPDATE_SUCCESS, updatedDoc.data);
                console.log(req.body);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const allStudents = yield auth_1.default.getAllStudents();
                if (!allStudents.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, allStudents.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getMyLearning(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email } = req.user;
                const user = yield user_2.default.findByEmail(email);
                if (!user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const myLearning = yield user_2.default.getMyLearning(user._id);
                if (!myLearning.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, myLearning.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.UserController = new UserControllerClass();
// Generated by CodiumAI
describe('getMyLearning', () => {
    // The method should return the user's learning data if it exists.
    it('should return the user\'s learning data if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: "example@example.com"
            }
        };
        const res = {
            status: function (statusCode) {
                expect(statusCode).toBe(200);
                return this;
            },
            send: function (response) {
                expect(response).toEqual(myLearning.data);
            }
        };
        const userController = new UserControllerClass();
        yield userController.getMyLearning(req, res);
    }));
});
