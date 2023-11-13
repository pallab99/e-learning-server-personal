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
const client_s3_1 = require("@aws-sdk/client-s3");
const createObjectParams_1 = require("../../helper/createObjectParams");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Config_1 = require("../../configs/s3Config");
const wishlist_1 = __importDefault(require("../../repository/wishlist"));
class WishlistServiceClass {
    getWishlistByUserId(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wishlist_1.default.findWishlistByUserId(userID);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    getDPFromServer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const thumbnailCommand = new client_s3_1.GetObjectCommand(params);
            const dpURI = yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, thumbnailCommand);
            if (dpURI) {
                return { success: true, data: dpURI };
            }
            return { success: false, data: [] };
        });
    }
    getWishlistByUserIdPopulated(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wishlist_1.default.findWishlistByUserIdPopulated(userID);
            console.log({ result });
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    getThumbnailFromServer(result) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(result);
            const data = yield Promise.all(result && result.courses.map((ele) => __awaiter(this, void 0, void 0, function* () {
                const DpObjectParams = (0, createObjectParams_1.createObjectParamsForS3)(ele.thumbnail);
                const thumbnail = yield this.getDPFromServer(DpObjectParams);
                return {
                    ele,
                    thumbnailURL: thumbnail.data,
                };
            })));
            if (data.length) {
                return { success: true, data };
            }
            return { success: false, data: [] };
        });
    }
    courseExistsInWishlist(courseId, wishlist) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const courseExists = (_a = wishlist === null || wishlist === void 0 ? void 0 : wishlist.courses) === null || _a === void 0 ? void 0 : _a.includes(courseId);
            return { success: courseExists, data: wishlist };
        });
    }
    addCourseToWishlistInExistingWishlist(courseId, wishlist) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = wishlist === null || wishlist === void 0 ? void 0 : wishlist.courses) === null || _a === void 0 ? void 0 : _a.push(courseId);
            wishlist.totalCourses += 1;
            yield wishlist.save();
            return {
                success: wishlist ? Object.keys(wishlist).length > 0 : false,
                data: wishlist,
            };
        });
    }
    addCourseToWishlistInNewWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wishlist_1.default.createNewWishlist(userId, courseId);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    removeCourseFromWishlist(wishlist, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = wishlist.courses.findIndex((ele) => {
                return String(ele) === courseId;
            });
            if (index != -1) {
                wishlist.courses.splice(index, 1);
                wishlist.totalCourses -= 1;
                yield wishlist.save();
            }
            return {
                success: wishlist ? Object.keys(wishlist).length > 0 : false,
                data: wishlist,
            };
        });
    }
}
const WishlistService = new WishlistServiceClass();
exports.default = WishlistService;
