import { Request, Response } from "express";
import { transporter } from "../../configs/mail";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CartService from "../../services/cart";
import CourseService from "../../services/course";
import PurchaseHistoryService from "../../services/purchase-history";
import SubscriptionService from "../../services/subscription";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import UserService from "../../services/user";
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");
const adminEmail = process.env.ADMIN_EMAIL as string;
class SubscriptionControllerClass {
  async applySubscription(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { cartId } = req.body;
      const cart = await CartService.findByIdPopulated(cartId);
      if (!cart.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_CART
        );
      }

      const user = cart.data.user._id;
      const courses = cart.data.courses;

      const applySubscription = await SubscriptionService.applySubscription(
        user,
        courses
      );

      if (!applySubscription.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SUBSCRIPTION_FAILED
        );
      }
      const URL = "http://localhost:5173/something-went-wrong";
      const htmlBody = await ejsRenderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "views",
          "course-subscription.ejs"
        ),
        {
          name: "Admin",
          user: `${cart.data.user.name}`,
          URL,
        }
      );
      const result = await transporter.sendMail({
        from: "book-heaven@system.com",
        to: `Admin Admin ${adminEmail}`,
        subject: "Verify Account",
        html: htmlBody,
      });
      const removeCart = await CartService.removeCart(cartId);

      if (!removeCart.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SUBSCRIPTION_FAILED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUBSCRIPTION_SUCCESS,
        applySubscription.data
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

  async getAllSubscriptionList(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const getAllSubscription =
        await SubscriptionService.getAllSubscriptionListPopulated();
      if (!getAllSubscription.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        getAllSubscription.data
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

  async getSubscriptionById(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { subscriptionId } = req.params;
      const subscription =
        await SubscriptionService.findByIdPopulated(subscriptionId);
      if (!subscription.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        subscription.data
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

  async acceptSubscription(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { subscriptionId, courseId } = req.params;
      const subscription =
        await SubscriptionService.findByIdPopulated(subscriptionId);

      if (!subscription.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const course = await CourseService.findById(courseId);

      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      const addToMyLearning = await UserService.addToMyLearning(
        courseId,
        subscription.data.user._id
      );
      const addUserToEnrollmentList =
        await CourseService.addUserToEnrollmentList(
          courseId,
          subscription.data.user._id
        );

      if (!addUserToEnrollmentList.success || !addToMyLearning.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      const removeCourseFromSubscriptionList =
        await SubscriptionService.removeCourseFromSubscriptionList(
          subscription.data,
          courseId
        );

      if (!removeCourseFromSubscriptionList.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      const addToPurchase = await PurchaseHistoryService.createPurchase(
        subscription.data.user._id,
        courseId
      );
      if (!addToPurchase) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      const htmlBody = await ejsRenderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "views",
          "subscription-accepted.ejs"
        ),
        {
          name: `${subscription.data.cart?.user.name}`,
          courseName: `${course.data.title}`,
        }
      );

      const result = await transporter.sendMail({
        from: "book-heaven@system.com",
        to: `${subscription.data.user.name} ${subscription.data.user.email}`,
        subject: "Course Subscription accepted",
        html: htmlBody,
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUBSCRIPTION_ACCEPTED_SUCCESS,
        course
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

  async rejectSubscription(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { subscriptionId, courseId } = req.params;
      const { rejectionDetails } = req.body;
      const subscription =
        await SubscriptionService.findByIdPopulated(subscriptionId);

      if (!subscription.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      console.log("subscription", subscription.data);

      const course = await CourseService.findById(courseId);

      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      const htmlBody = await ejsRenderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "views",
          "subscription-rejected.ejs"
        ),
        {
          name: `${subscription.data.cart?.user.name}`,
          courseName: `${course.data.title}`,
          details: rejectionDetails,
        }
      );

      const result = await transporter.sendMail({
        from: "book-heaven@system.com",
        to: `${subscription.data.user.name} ${subscription.data.user.email}`,
        subject: "Course Subscription rejected",
        html: htmlBody,
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUBSCRIPTION_REJECTED_EMAIL
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

const SubscriptionController = new SubscriptionControllerClass();
export default SubscriptionController;
