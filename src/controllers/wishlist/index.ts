import { Request, Response } from "express";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constant/statusCode";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import WishlistService from "../../services/wishlist";
class WishlistControllerClass {
  async addToWishlist(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.body;
      const { id } = req.user;
      let wishlist = await WishlistService.getWishlistByUserId(id);
      if (wishlist.success) {
        const courseExistsInWishlist = await WishlistService.courseExistsInWishlist(
          courseId,
          wishlist.data
        );
        if (courseExistsInWishlist.success) {
          return sendResponse(
            res,
            HTTP_STATUS.CONFLICT,
            RESPONSE_MESSAGE.COURSE_ALREADY_IN_WISHLIST
          );
        } else {
          const addToWishlist = await WishlistService.addCourseToWishlistInExistingWishlist(
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
        wishlist = await WishlistService.addCourseToWishlistInNewWishlist(id, courseId);
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
      const { id } = req.user;
      let wishlist = await WishlistService.getWishlistByUserIdPopulated(id);
      if (!wishlist.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_WISHLIST, []);
      }

      const data = await WishlistService.getThumbnailFromServer(wishlist.data);
      if (!data.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        data.data
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
      const { id } = req.user;
      const wishlist = await WishlistService.getWishlistByUserId(id);
      if (!wishlist.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_WISHLIST, []);
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
