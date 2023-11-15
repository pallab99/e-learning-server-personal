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
const wishlist_1 = require("../../models/wishlist");
class WishlistRepositoryClass {
    findWishlistByUserId(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.WishlistModel.findOne({
                user: new mongoose_1.default.Types.ObjectId(userID),
            });
        });
    }
    findWishlistByUserIdPopulated(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.WishlistModel.findOne({
                user: new mongoose_1.default.Types.ObjectId(userID),
            }).populate({
                path: "courses",
                populate: {
                    path: "instructors",
                },
            });
        });
    }
    createNewWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wishlist_1.WishlistModel.create({
                user: userId,
                courses: [courseId],
                totalCourses: 1,
            });
        });
    }
}
const WishlistRepository = new WishlistRepositoryClass();
exports.default = WishlistRepository;
