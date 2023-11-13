import { Response } from "express";
import { ValidationError } from "express-validator";
import { RESPONSE_MESSAGE } from "../constant/responseMessage";
import { HTTP_STATUS } from "../constant/statusCode";
import { sendResponse } from "./response";

export const sendValidationError = (
  res: Response,
  validation: ValidationError[]
) => {
  const error: any = {};
  validation.forEach((ele: any) => {
    const property = ele.path;
    error[property] = ele.msg;
  });
  return sendResponse(
    res,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    RESPONSE_MESSAGE.UNPROCESSABLE_ENTITY,
    error
  );
};

module.exports = { sendValidationError };
