import { Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import UserService from "../../services/user";
import WishlistService from "../../services/wishlist";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
class WishlistControllerClass {
  async addToWishlist(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.body;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      let wishlist = await WishlistService.getWishlistByUserId(user?._id);
      if (wishlist.success) {
        const courseExistsInWishlist =
          await WishlistService.courseExistsInWishlist(courseId, wishlist.data);
        if (courseExistsInWishlist.success) {
          return sendResponse(
            res,
            HTTP_STATUS.CONFLICT,
            RESPONSE_MESSAGE.COURSE_ALREADY_IN_WISHLIST
          );
        } else {
          const addToWishlist =
            await WishlistService.addCourseToWishlistInExistingWishlist(
              courseId,
              wishlist.data
            );
          if (!addToWishlist.success) {
            return sendResponse(
              res,
              HTTP_STATUS.BAD_REQUEST,
              RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
            );
          }
        }
      } else {
        wishlist = await WishlistService.addCourseToWishlistInNewWishlist(
          user?._id,
          courseId
        );
        if (!wishlist.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.COURSE_ADDED_TO_WISHLIST,
        wishlist.data
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

  async getWishlistByUserId(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      let wishlist = await WishlistService.getWishlistByUserIdPopulated(
        user?._id
      );
      if (!wishlist.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.NO_WISHLIST,
          []
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        wishlist.data
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

  async updateWishlist(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.body;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const wishlist = await WishlistService.getWishlistByUserId(user?._id);
      if (!wishlist.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.NO_WISHLIST,
          []
        );
      }

      const updatedWishlist = await WishlistService.removeCourseFromWishlist(
        wishlist.data,
        courseId
      );
      if (!updatedWishlist.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.WISHLIST_UPDATED,
        updatedWishlist
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

const WishlistController = new WishlistControllerClass();

export default WishlistController;
