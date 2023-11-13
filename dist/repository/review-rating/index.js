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
const review_rating_1 = require("../../models/review-rating");
class ReviewRatingRepositoryClass {
    addReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.create({
                user: reviewData.user,
                course: reviewData.course,
                rating: reviewData.rating,
                reviewMessage: reviewData.reviewMessage,
            });
        });
    }
    reviewExists(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.findOne({
                course: new mongoose_1.default.Types.ObjectId(courseId),
                user: new mongoose_1.default.Types.ObjectId(userId),
            });
        });
    }
    findById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.findById(reviewId);
        });
    }
    findByIdAndUpdate(reviewId, reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.findByIdAndUpdate(reviewId, reviewData, {
                new: true,
            });
        });
    }
    getReviewsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.find({
                course: new mongoose_1.default.Types.ObjectId(courseId),
            });
        });
    }
    findByIdAndDelete(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield review_rating_1.ReviewRatingModel.findByIdAndDelete(reviewId, {
                new: true,
            });
        });
    }
}
const ReviewRatingRepository = new ReviewRatingRepositoryClass();
exports.default = ReviewRatingRepository;
