import express from "express";
import ReviewRatingController from "../../controllers/review-rating";
import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .post(
    "/create/:courseId",
    [tokenAuthorization, isStudent, ...validator.addReview],
    ReviewRatingController.addReviewRating
  )
  .patch(
    "/update/:reviewId",
    [tokenAuthorization, isStudent, ...validator.updateReview],
    ReviewRatingController.updateReviewRating
  )
  .get("/all/:courseId", ReviewRatingController.getReviewByCourseId)
  .delete(
    "/delete/:courseId/:reviewId",
    [tokenAuthorization, isStudent],
    ReviewRatingController.deleteReview
  );

export default router;
