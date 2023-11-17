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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = require("../../configs/mail");
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const auth_1 = require("../../models/auth");
const auth_2 = __importDefault(require("../../services/auth"));
const user_1 = __importDefault(require("../../services/user"));
const bcrypt_2 = require("../../utils/bcrypt");
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const tokenGenerator_1 = require("../../utils/tokenGenerator");
const crypto = require("crypto");
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");
const jwt = require("jsonwebtoken");
class AuthControllerClass {
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email, password, confirmPassword, name, phoneNumber, notificationSetting, rank, } = req.body;
                const emailExistsInAuth = yield auth_2.default.findByEmail(email);
                const emailExistsInUser = yield user_1.default.findByEmail(email);
                const samePassword = yield auth_2.default.samePassword(password, confirmPassword);
                const hashedPassword = yield auth_2.default.hashPassword(password);
                if (emailExistsInAuth || emailExistsInUser) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, responseMessage_1.RESPONSE_MESSAGE.EMAIL_EXISTS);
                }
                if (!samePassword) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.PASSWORD_NOT_MATCH);
                }
                const createUserInUser = yield user_1.default.createUserInUser(name, email, phoneNumber, notificationSetting);
                if (!createUserInUser) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const createNewUserInAuth = yield auth_2.default.createUserInAuth(email, hashedPassword, rank, createUserInUser._id);
                if (!createNewUserInAuth) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const resetToken = crypto.randomBytes(64).toString("hex");
                const verifyAccountUrl = `http://localhost:8000/api/auth/validate-verify-account/${resetToken}/${createNewUserInAuth._id.toString()}`;
                const htmlBody = yield ejsRenderFile(path.join(__dirname, "..", "..", "..", "src", "views", "verify-account.ejs"), {
                    name: createUserInUser.name,
                    verifyAccountUrl,
                });
                const result = yield mail_1.transporter.sendMail({
                    from: "book-heaven@system.com",
                    to: `${createUserInUser.name} ${email}`,
                    subject: "Verify Account",
                    html: htmlBody,
                });
                if (result.messageId) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.CREATED, responseMessage_1.RESPONSE_MESSAGE.REGISTRATION_SUCCESSFUL);
                }
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email, password } = req.body;
                const emailFoundInAuth = yield auth_2.default.findByEmail(email);
                const emailFoundInUser = yield user_1.default.findByEmail(email);
                if (!emailFoundInAuth || !emailFoundInUser) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.EMAIL_NOT_EXISTS);
                }
                const comparePassword = yield auth_2.default.comparePassword(password, emailFoundInAuth.password);
                if (!comparePassword) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.WRONG_CREDENTIAL);
                }
                const isEmailVerified = yield auth_2.default.isEmailVerified(emailFoundInAuth._id);
                if (!isEmailVerified) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.VERIFY_EMAIL);
                }
                const userDisabled = yield auth_2.default.userDisabled(email);
                if (userDisabled) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.USER_RESTRICTED);
                }
                const data = {
                    id: emailFoundInAuth._id,
                    email: emailFoundInAuth.email,
                    name: emailFoundInUser.name,
                    phoneNumber: emailFoundInUser.phoneNumber,
                    rank: emailFoundInAuth.rank,
                };
                const accessToken = (0, tokenGenerator_1.generateAccessToken)(data);
                const refreshToken = (0, tokenGenerator_1.generateRefreshToken)(data);
                res.cookie("accessToken", accessToken, { path: "/" });
                res.cookie("refreshToken", refreshToken, { path: "/" });
                data.accessToken = accessToken;
                data.refreshToken = refreshToken;
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SIGN_IN_SUCCESSFUL, data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    validateVerifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resetToken, userId } = req.params;
                const auth = yield auth_2.default.findById(userId);
                const wrongURL = "http://localhost:5173/something-went-wrong";
                if (!auth || auth.isVerified) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                res.redirect(`http://localhost:8000/api/auth/verify-account/${resetToken}/${auth._id.toString()}`);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resetToken, userId } = req.params;
                const auth = yield auth_2.default.findById(userId);
                if (!auth || auth.isVerified) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                auth.isVerified = true;
                yield auth_2.default.save(auth);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.EMAIL_VERIFIED);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, "Token can not be null");
                }
                const token = refreshToken;
                const secretKey = process.env.REFRESH_TOKEN_SECRET;
                const decoded = yield jwt.verify(token, secretKey);
                delete decoded.iat;
                delete decoded.exp;
                if (decoded) {
                    const accessToken = (0, tokenGenerator_1.generateAccessToken)(decoded);
                    res.cookie("accessToken", accessToken, { path: "/" });
                    if (accessToken) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ACCESS_TOKEN_GENERATED, accessToken);
                    }
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
            }
            catch (error) {
                (0, dbLogger_1.databaseLogger)(error.message);
                if (error instanceof jwt.TokenExpiredError) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.LOGIN_AGAIN);
                }
                if (error instanceof jwt.JsonWebTokenError) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNAUTHORIZED, responseMessage_1.RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS);
            }
        });
    }
    sendEmailForPassWordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const auth = yield auth_2.default.findByEmail(email);
                const user = yield user_1.default.findByEmail(email);
                if (!auth || !user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const resetToken = crypto.randomBytes(64).toString("hex");
                const resetURL = `http://localhost:8000/api/auth/validate-reset-password/${resetToken}/${auth._id.toString()}`;
                auth.resetPasswordToken = resetToken;
                auth.resetPassword = true;
                auth.resetPasswordExpired = Date.now() + 60 * 60 * 1000;
                yield auth_2.default.save(auth);
                const htmlBody = yield ejsRenderFile(path.join(__dirname, "..", "..", "..", "src", "views", "forget-password.ejs"), {
                    name: user.name,
                    resetURL,
                });
                const result = yield mail_1.transporter.sendMail({
                    from: "book-heaven@system.com",
                    to: `${user.name} ${email}`,
                    subject: "Forget Password",
                    html: htmlBody,
                });
                if (result.messageId) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.REQUEST_RESET_PASSWORD);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
            }
        });
    }
    validateResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resetToken, userId } = req.params;
                const auth = yield auth_2.default.findById(userId);
                const wrongURL = "http://localhost:5173/something-went-wrong";
                if (!auth ||
                    !auth.resetPasswordToken ||
                    auth.resetPasswordToken !== resetToken ||
                    !auth.resetPassword ||
                    (auth.resetPasswordExpired &&
                        typeof auth.resetPasswordExpired === "number" &&
                        auth.resetPasswordExpired < Date.now())) {
                    res.redirect(wrongURL);
                    return;
                }
                res.redirect(`http://localhost:5173/forget-password/${resetToken}/${userId}`);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password, confirmPassword, resetToken, userId } = req.body;
                const auth = yield auth_1.AuthModel.findOne({ _id: userId });
                if (!auth) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                if (resetToken != auth.resetPasswordToken || !auth) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, "Something went wrong", []);
                }
                if (password !== confirmPassword) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, "Password and confirm password need to be same", []);
                }
                if (yield bcrypt_1.default.compare(password, auth.password)) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, "Your new password and previous password can not be same", []);
                }
                const hashedPassword = yield (0, bcrypt_2.hashPasswordUsingBcrypt)(password);
                auth.password = hashedPassword;
                (auth.resetPasswordToken = null), (auth.resetPasswordExpired = null);
                auth.resetPassword = null;
                yield auth.save();
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, "Reset password successfully", []);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
            }
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.cookies["accessToken"];
                const refreshToken = req.cookies["refreshToken"];
                if (!accessToken || !refreshToken) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, "Something went wrong", []);
                }
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, "Log Out Successful", []);
            }
            catch (error) {
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
            }
        });
    }
}
const AuthController = new AuthControllerClass();
exports.AuthController = AuthController;
