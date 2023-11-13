import { Request, Response } from "express";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constant/statusCode";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import PurchaseHistoryService from "../../services/purchase-history";
import UserService from "../../services/user";
class PurchaseHistoryControllerClass {
  async getAllPurchase(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const allPurchase = await PurchaseHistoryService.getAllPurchase();

      if (!allPurchase.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA);
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allPurchase.data
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

  async getPurchaseById(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { purchaseId } = req.params;

      const purchaseById = await PurchaseHistoryService.findById(purchaseId);
      if (!purchaseById.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        purchaseById.data
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

  async getPurchaseByUser(req: Request, res: Response) {
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
      const purchaseByUser = await PurchaseHistoryService.findByUser(user._id);
      if (!purchaseByUser.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        purchaseByUser.data
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

const PurchaseHistoryController = new PurchaseHistoryControllerClass();
export default PurchaseHistoryController;
