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
const review_rating_1 = __importDefault(require("../../repository/review-rating"));
class ReviewRatingServiceClass {
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.addReview(reviewData);
            return { success: result ? true : false, data: result };
        });
    }
    reviewAlreadyExists(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.reviewExists(courseId, userId);
            return { success: result ? true : false, data: result };
        });
    }
    findById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.findById(reviewId);
            return { success: result ? true : false, data: result };
        });
    }
    findByIdAndUpdate(reviewId, reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.findByIdAndUpdate(reviewId, reviewData);
            return { success: result ? true : false, data: result };
        });
    }
    allReviewsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.getReviewsByCourse(courseId);
            return { success: result ? true : false, data: result };
        });
    }
    findByIdAndDelete(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield review_rating_1.default.findByIdAndDelete(reviewId);
            console.log(result);
            return { success: result ? true : false, data: result };
        });
    }
}
const ReviewRatingService = new ReviewRatingServiceClass();
exports.default = ReviewRatingService;
