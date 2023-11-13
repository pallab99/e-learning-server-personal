import { Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CartService from "../../services/cart";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
class CartControllerClass {
  async addToCart(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.body;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NOT_FOUND
        );
      }
      let cart = await CartService.getCartByUserId(user._id);
      if (cart.success) {
        const courseExistsInCart = await CartService.courseExistsInCart(
          courseId,
          cart.data
        );
        if (courseExistsInCart.success) {
          return sendResponse(
            res,
            HTTP_STATUS.CONFLICT,
            RESPONSE_MESSAGE.COURSE_ALREADY_IN_CART
          );
        } else {
          const addToCart = await CartService.addCourseToCartInExistingCart(
            courseId,
            cart.data
          );
          if (!addToCart.success) {
            return sendResponse(
              res,
              HTTP_STATUS.BAD_REQUEST,
              RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
            );
          }
        }
      } else {
        cart = await CartService.addCourseToCartInNewCart(user._id, courseId);
        if (!cart.success) {
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
        RESPONSE_MESSAGE.COURSE_ADDED_TO_CART,
        cart.data
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

  async getCartByUserId(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;
      const user = await UserService.findByEmail(email);

      if (!user) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_CART, []);
      }
      let cart = await CartService.getCartByUserIdPopulated(user._id);
      if (!cart.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_CART, []);
      }

      const data = await CartService.getThumbnailFromServer(cart.data);
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
        cart.data
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

  async updateCart(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.body;
      const { id } = req.user;
      const cart = await CartService.getCartByUserId(id);
      if (!cart.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_CART, []);
      }

      const updatedCart = await CartService.removeCourseFromCart(
        cart.data,
        courseId
      );
      if (!updatedCart.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.CART_UPDATED,
        updatedCart
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

const CartController = new CartControllerClass();

export default CartController;
