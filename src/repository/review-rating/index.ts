import mongoose from "mongoose";
import { ReviewRatingModel } from "../../models/review-rating";
import { IReviewRating, IUpdateReview } from "../../types/review-rating";

class ReviewRatingRepositoryClass {
  async addReview(reviewData: IReviewRating) {
    return await ReviewRatingModel.create({
      user: reviewData.user,
      course: reviewData.course,
      rating: reviewData.rating,
      reviewMessage: reviewData.reviewMessage,
    });
  }

  async reviewExists(courseId: string, userId: string) {
    return await ReviewRatingModel.findOne({
      course: new mongoose.Types.ObjectId(courseId),
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  async findById(reviewId: string) {
    return await ReviewRatingModel.findById(reviewId);
  }
  async findByIdAndUpdate(reviewId: string, reviewData: IUpdateReview) {
    return await ReviewRatingModel.findByIdAndUpdate(reviewId, reviewData, {
      new: true,
    });
  }

  async getReviewsByCourse(courseId: string) {
    return await ReviewRatingModel.find({
      course: new mongoose.Types.ObjectId(courseId),
    });
  }

  async findByIdAndDelete(reviewId: string) {
    return await ReviewRatingModel.findByIdAndDelete(reviewId, {
      new: true,
    });
  }
}

const ReviewRatingRepository = new ReviewRatingRepositoryClass();
export default ReviewRatingRepository;
