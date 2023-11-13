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
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const statusCode_1 = require("../../constant/statusCode");
const responseMessage_1 = require("../../constant/responseMessage");
const wishlist_1 = __importDefault(require("../../services/wishlist"));
class WishlistControllerClass {
    addToWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.body;
                const { id } = req.user;
                let wishlist = yield wishlist_1.default.getWishlistByUserId(id);
                if (wishlist.success) {
                    const courseExistsInWishlist = yield wishlist_1.default.courseExistsInWishlist(courseId, wishlist.data);
                    if (courseExistsInWishlist.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.CONFLICT, responseMessage_1.RESPONSE_MESSAGE.COURSE_ALREADY_IN_WISHLIST);
                    }
                    else {
                        const addToWishlist = yield wishlist_1.default.addCourseToWishlistInExistingWishlist(courseId, wishlist.data);
                        if (!addToWishlist.success) {
                            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                        }
                    }
                }
                else {
                    wishlist = yield wishlist_1.default.addCourseToWishlistInNewWishlist(id, courseId);
                    if (!wishlist.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                    }
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.COURSE_ADDED_TO_WISHLIST, wishlist.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getWishlistByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { id } = req.user;
                let wishlist = yield wishlist_1.default.getWishlistByUserIdPopulated(id);
                if (!wishlist.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_WISHLIST, []);
                }
                const data = yield wishlist_1.default.getThumbnailFromServer(wishlist.data);
                if (!data.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, data.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.body;
                const { id } = req.user;
                const wishlist = yield wishlist_1.default.getWishlistByUserId(id);
                if (!wishlist.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_WISHLIST, []);
                }
                const updatedWishlist = yield wishlist_1.default.removeCourseFromWishlist(wishlist.data, courseId);
                if (!updatedWishlist.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.WISHLIST_UPDATED, updatedWishlist);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const WishlistController = new WishlistControllerClass();
exports.default = WishlistController;
