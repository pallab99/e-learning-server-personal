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
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = require("../../models/cart");
class CartRepositoryClass {
    findCartByUserId(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.CartModel.findOne({
                user: new mongoose_1.default.Types.ObjectId(userID),
            });
        });
    }
    findCartByUserIdPopulated(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.CartModel.findOne({
                user: new mongoose_1.default.Types.ObjectId(userID),
            }).populate("courses");
        });
    }
    createNewCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.CartModel.create({
                user: userId,
                courses: [courseId],
                totalCourses: 1,
            });
        });
    }
    findByIdPopulated(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.CartModel.findById(cartId).populate("user");
        });
    }
    removeCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.CartModel.findByIdAndDelete(cartId, { new: true });
        });
    }
}
const CartRepository = new CartRepositoryClass();
exports.default = CartRepository;
