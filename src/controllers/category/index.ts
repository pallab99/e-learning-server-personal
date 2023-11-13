import { Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CategoryService from "../../services/category";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
class CategoryControllerClass {
  async addCategory(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { title }: { title: string } = req.body;
      const lowerTitle = title.toLowerCase();
      const findByTitle = await CategoryService.findByTitle(lowerTitle);
      console.log(findByTitle);

      if (findByTitle.success) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          RESPONSE_MESSAGE.CATEGORY_EXISTS
        );
      }

      const newCategory = await CategoryService.createCategory(lowerTitle);
      console.log({ newCategory });

      if (!newCategory.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.CATEGORY_CREATE_FAILED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.CATEGORY_CREATE_SUCCESS,
        newCategory.data
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

  async getAllCategory(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const allCategory = await CategoryService.allCategory();

      if (!allCategory.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA);
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allCategory.data
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

const CategoryController = new CategoryControllerClass();
export default CategoryController;
