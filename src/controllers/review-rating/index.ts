import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseService from "../../services/course";
import ReviewRatingService from "../../services/review-rating";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
import { ReviewRatingModel } from "../../models/review-rating";
import mongoose from "mongoose";
class ReviewRatingControllerClass {
  async addReviewRating(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId } = req.params;
      const { reviewMessage, rating } = req.body;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      console.log(req.body);

      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const userSubscribedInCourse = await CourseService.userAvailableInCourse(
        courseId,
        user._id
      );
      if (!userSubscribedInCourse.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.SUBSCRIBE_COURSE_BEFORE_ADDING_REVIEW
        );
      }
      const reviewAlreadyExists = await ReviewRatingService.reviewAlreadyExists(
        courseId,
        user._id
      );

      if (reviewAlreadyExists.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.REVIEW_EXISTS
        );
      }
      const reviewData = {
        user: user._id,
        course: courseId,
        reviewMessage,
        rating,
      };
      const createReviewRating =
        await ReviewRatingService.createReview(reviewData);
      if (!createReviewRating.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ADD_REVIEW_FAILED
        );
      }
      const addReviewRatingToCourse =
        await CourseService.addReviewRatingToCourse(
          createReviewRating.data._id,
          userSubscribedInCourse.data
        );
      if (!addReviewRatingToCourse.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ADD_REVIEW_FAILED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ADD_REVIEW_SUCCESS,
        createReviewRating.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateReviewRating(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { reviewId } = req.params;

      const review = await ReviewRatingService.findById(reviewId);
      if (!review.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const updateDoc = await ReviewRatingService.findByIdAndUpdate(
        reviewId,
        req.body
      );
      if (!updateDoc.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.UPDATE_REVIEW_FAILED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.UPDATE_REVIEW_SUCCESS,
        updateDoc.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getReviewByCourseId(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const allReviewByCourse =
        await ReviewRatingService.allReviewsByCourse(courseId);
      if (!allReviewByCourse.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA);
      }
      const averageRating = await ReviewRatingModel.aggregate([
        {
          $match: {
            course: new mongoose.Types.ObjectId(courseId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
          },
        },
      ]).exec();
      const data = {
        data: allReviewByCourse.data,
        averageRating:averageRating[0].averageRating,
      };
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, reviewId } = req.params;

      const review = await ReviewRatingService.findById(reviewId);
      const course = await CourseService.findById(courseId);
      if (!review.success || !course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const deletedReview =
        await ReviewRatingService.findByIdAndDelete(reviewId);
      if (!deletedReview.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.DELETE_REVIEW_FAILED
        );
      }
      const removeReviewFromCourse = await CourseService.removeReviewFromCourse(
        reviewId,
        course.data
      );
      if (!removeReviewFromCourse.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.DELETE_REVIEW_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.DELETE_REVIEW_SUCCESS
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }
}

const ReviewRatingController = new ReviewRatingControllerClass();
export default ReviewRatingController;
