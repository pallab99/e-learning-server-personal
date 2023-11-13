import ReviewRatingRepository from "../../repository/review-rating";
import { IReviewRating, IUpdateReview } from "../../types/review-rating";

class ReviewRatingServiceClass {
  async createReview(reviewData: IReviewRating) {
    const result = await ReviewRatingRepository.addReview(reviewData);
    return { success: result ? true : false, data: result };
  }

  async reviewAlreadyExists(courseId: string, userId: string) {
    const result = await ReviewRatingRepository.reviewExists(courseId, userId);
    return { success: result ? true : false, data: result };
  }

  async findById(reviewId: string) {
    const result = await ReviewRatingRepository.findById(reviewId);
    return { success: result ? true : false, data: result };
  }

  async findByIdAndUpdate(reviewId: string, reviewData: IUpdateReview) {
    const result = await ReviewRatingRepository.findByIdAndUpdate(
      reviewId,
      reviewData
    );
    return { success: result ? true : false, data: result };
  }

  async allReviewsByCourse(courseId: string) {
    const result = await ReviewRatingRepository.getReviewsByCourse(courseId);
    return { success: result ? true : false, data: result };
  }
  async findByIdAndDelete(reviewId: string) {
    const result = await ReviewRatingRepository.findByIdAndDelete(reviewId);
    console.log(result);

    return { success: result ? true : false, data: result };
  }
}
const ReviewRatingService = new ReviewRatingServiceClass();
export default ReviewRatingService;
