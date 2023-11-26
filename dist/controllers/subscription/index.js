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
const mail_1 = require("../../configs/mail");
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const cart_1 = __importDefault(require("../../services/cart"));
const course_1 = __importDefault(require("../../services/course"));
const purchase_history_1 = __importDefault(require("../../services/purchase-history"));
const subscription_1 = __importDefault(require("../../services/subscription"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const user_1 = __importDefault(require("../../services/user"));
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");
const adminEmail = process.env.ADMIN_EMAIL;
class SubscriptionControllerClass {
    applySubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { cartId } = req.body;
                const cart = yield cart_1.default.findByIdPopulated(cartId);
                if (!cart.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_CART);
                }
                const user = cart.data.user._id;
                const courses = cart.data.courses;
                const applySubscription = yield subscription_1.default.applySubscription(user, courses);
                if (!applySubscription.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SUBSCRIPTION_FAILED);
                }
                const URL = "http://localhost:5173/something-went-wrong";
                const htmlBody = yield ejsRenderFile(path.join(__dirname, "..", "..", "..", "src", "views", "course-subscription.ejs"), {
                    name: "Admin",
                    user: `${cart.data.user.name}`,
                    URL,
                });
                const result = yield mail_1.transporter.sendMail({
                    from: "book-heaven@system.com",
                    to: `Admin Admin ${adminEmail}`,
                    subject: "Request for course subscription",
                    html: htmlBody,
                });
                const removeCart = yield cart_1.default.removeCart(cartId);
                if (!removeCart.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SUBSCRIPTION_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUBSCRIPTION_SUCCESS, applySubscription.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllSubscriptionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const getAllSubscription = yield subscription_1.default.getAllSubscriptionListPopulated();
                if (!getAllSubscription.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, getAllSubscription.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getSubscriptionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { subscriptionId } = req.params;
                const subscription = yield subscription_1.default.findByIdPopulated(subscriptionId);
                if (!subscription.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, subscription.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    acceptSubscription(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { subscriptionId, courseId } = req.params;
                const subscription = yield subscription_1.default.findByIdPopulated(subscriptionId);
                if (!subscription.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const course = yield course_1.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                const addToMyLearning = yield user_1.default.addToMyLearning(courseId, subscription.data.user._id);
                const addUserToEnrollmentList = yield course_1.default.addUserToEnrollmentList(courseId, subscription.data.user._id);
                if (!addUserToEnrollmentList.success || !addToMyLearning.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const removeCourseFromSubscriptionList = yield subscription_1.default.removeCourseFromSubscriptionList(subscription.data, courseId);
                if (!removeCourseFromSubscriptionList.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const addToPurchase = yield purchase_history_1.default.createPurchase(subscription.data.user._id, courseId);
                if (!addToPurchase) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const htmlBody = yield ejsRenderFile(path.join(__dirname, "..", "..", "..", "src", "views", "subscription-accepted.ejs"), {
                    name: `${(_a = subscription.data.cart) === null || _a === void 0 ? void 0 : _a.user.name}`,
                    courseName: `${course.data.title}`,
                });
                const result = yield mail_1.transporter.sendMail({
                    from: "book-heaven@system.com",
                    to: `${subscription.data.user.name} ${subscription.data.user.email}`,
                    subject: "Course Subscription accepted",
                    html: htmlBody,
                });
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUBSCRIPTION_ACCEPTED_SUCCESS, course);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    rejectSubscription(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { subscriptionId, courseId } = req.params;
                const { rejectionDetails } = req.body;
                const subscription = yield subscription_1.default.findByIdPopulated(subscriptionId);
                if (!subscription.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                console.log("subscription", subscription.data);
                const course = yield course_1.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                const htmlBody = yield ejsRenderFile(path.join(__dirname, "..", "..", "..", "src", "views", "subscription-rejected.ejs"), {
                    name: `${(_a = subscription.data.cart) === null || _a === void 0 ? void 0 : _a.user.name}`,
                    courseName: `${course.data.title}`,
                    details: rejectionDetails,
                });
                const result = yield mail_1.transporter.sendMail({
                    from: "book-heaven@system.com",
                    to: `${subscription.data.user.name} ${subscription.data.user.email}`,
                    subject: "Course Subscription rejected",
                    html: htmlBody,
                });
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUBSCRIPTION_REJECTED_EMAIL);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const SubscriptionController = new SubscriptionControllerClass();
exports.default = SubscriptionController;
