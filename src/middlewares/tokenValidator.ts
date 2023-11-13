const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
import { NextFunction, Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../constant/responseMessage";
import { HTTP_STATUS } from "../constant/statusCode";
import { userType } from "../constant/user";
import { sendResponse } from "../utils/response";
const tokenAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);

    if (validate) {
      req.user = validate;
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);
    if (validate.rank === userType.admin) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};

const isStudent = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);
    if (validate.rank === userType.student) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};

const isInstructor = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);
    if (validate.rank === userType.instructor) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};

const isStudentOrInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);
    if (validate.rank === userType.instructor || userType.student) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};
const isStudentOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("hello");

    const { accessToken } = req.cookies;
    console.log({ accessToken });

    if (!accessToken) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    const token = accessToken;
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const validate = jwt.verify(token, secretKey);
    if (validate.rank === userType.admin || userType.student) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    return sendResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGE.UNAUTHORIZED_ACCESS
    );
  }
};
export {
  isAdmin,
  isInstructor,
  isStudent,
  tokenAuthorization,
  isStudentOrInstructor,
  isStudentOrAdmin,
};
