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
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Config_1 = require("../../configs/s3Config");
const createObjectParams_1 = require("../../helper/createObjectParams");
const cart_1 = __importDefault(require("../../repository/cart"));
class CartServiceClass {
    getCartByUserId(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.findCartByUserId(userID);
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
    getCartByUserIdPopulated(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.findCartByUserIdPopulated(userID);
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
            const data = yield Promise.all(result &&
                result.courses.map((ele) => __awaiter(this, void 0, void 0, function* () {
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
    courseExistsInCart(courseId, cart) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const courseExists = (_a = cart === null || cart === void 0 ? void 0 : cart.courses) === null || _a === void 0 ? void 0 : _a.includes(courseId);
            return { success: courseExists, data: cart };
        });
    }
    addCourseToCartInExistingCart(courseId, cart) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = cart === null || cart === void 0 ? void 0 : cart.courses) === null || _a === void 0 ? void 0 : _a.push(courseId);
            cart.totalCourses += 1;
            yield cart.save();
            return {
                success: cart ? Object.keys(cart).length > 0 : false,
                data: cart,
            };
        });
    }
    addCourseToCartInNewCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.createNewCart(userId, courseId);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    removeCourseFromCart(cartId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.removeCourseFromCart(cartId, courseId);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    findByIdPopulated(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.findByIdPopulated(cartId);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
    removeCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield cart_1.default.removeCart(cartId);
            return {
                success: result ? Object.keys(result).length > 0 : false,
                data: result,
            };
        });
    }
}
const CartService = new CartServiceClass();
exports.default = CartService;
