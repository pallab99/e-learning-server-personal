import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { transporter } from "../../configs/mail";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import { AuthModel } from "../../models/auth";
import AuthService from "../../services/auth";
import UserService from "../../services/user";
import { ILogin, ILoginResponse, IRegistration } from "../../types/authTypes";
import { hashPasswordUsingBcrypt } from "../../utils/bcrypt";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenGenerator";
const crypto = require("crypto");
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const path = require("path");
const jwt = require("jsonwebtoken");
class AuthControllerClass {
  async signUp(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);

      const {
        email,
        password,
        confirmPassword,
        name,
        phoneNumber,
        notificationSetting,
        rank,
      }: IRegistration = req.body;

      const emailExistsInAuth = await AuthService.findByEmail(email);
      const emailExistsInUser = await UserService.findByEmail(email);
      const samePassword = await AuthService.samePassword(
        password,
        confirmPassword
      );
      const hashedPassword = await AuthService.hashPassword(password);

      if (emailExistsInAuth || emailExistsInUser) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          RESPONSE_MESSAGE.EMAIL_EXISTS
        );
      }

      if (!samePassword) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.PASSWORD_NOT_MATCH
        );
      }

      const createUserInUser = await UserService.createUserInUser(
        name,
        email,
        phoneNumber,
        notificationSetting
      );

      if (!createUserInUser) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      const createNewUserInAuth = await AuthService.createUserInAuth(
        email,
        hashedPassword,
        rank,
        createUserInUser._id
      );

      if (!createNewUserInAuth) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      const resetToken = crypto.randomBytes(64).toString("hex");
      const verifyAccountUrl = `http://localhost:8000/api/auth/validate-verify-account/${resetToken}/${createNewUserInAuth._id.toString()}`;
      const htmlBody = await ejsRenderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "views",
          "verify-account.ejs"
        ),
        {
          name: createUserInUser.name,
          verifyAccountUrl,
        }
      );
      const result = await transporter.sendMail({
        from: "book-heaven@system.com",
        to: `${createUserInUser.name} ${email}`,
        subject: "Verify Account",
        html: htmlBody,
      });
      if (result.messageId) {
        return sendResponse(
          res,
          HTTP_STATUS.CREATED,
          RESPONSE_MESSAGE.REGISTRATION_SUCCESSFUL
        );
      }
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

  async signIn(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);

      const { email, password }: ILogin = req.body;
      const emailFoundInAuth = await AuthService.findByEmail(email);
      const emailFoundInUser = await UserService.findByEmail(email);

      if (!emailFoundInAuth || !emailFoundInUser) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.EMAIL_NOT_EXISTS
        );
      }
      const comparePassword = await AuthService.comparePassword(
        password,
        emailFoundInAuth.password
      );
      if (!comparePassword) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.WRONG_CREDENTIAL
        );
      }
      const isEmailVerified = await AuthService.isEmailVerified(
        emailFoundInAuth._id
      );
      if (!isEmailVerified) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.VERIFY_EMAIL
        );
      }

      const userDisabled = await AuthService.userDisabled(email);
      if (userDisabled) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.USER_RESTRICTED
        );
      }

      const data: ILoginResponse = {
        id: emailFoundInAuth._id,
        email: emailFoundInAuth.email,
        name: emailFoundInUser.name,
        phoneNumber: emailFoundInUser.phoneNumber,
        rank: emailFoundInAuth.rank,
      };
      const accessToken = generateAccessToken(data);
      const refreshToken = generateRefreshToken(data);
      res.cookie("accessToken", accessToken, { path: "/" });
      res.cookie("refreshToken", refreshToken, { path: "/" });

      data.accessToken = accessToken;
      data.refreshToken = refreshToken;

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SIGN_IN_SUCCESSFUL,
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

  async validateVerifyAccount(req: Request, res: Response) {
    try {
      const { resetToken, userId } = req.params;
      const auth = await AuthService.findById(userId);
      const wrongURL = "http://localhost:5173/something-went-wrong";
      if (!auth || auth.isVerified) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      res.redirect(
        `http://localhost:8000/api/auth/verify-account/${resetToken}/${auth._id.toString()}`
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

  async verifyAccount(req: Request, res: Response) {
    try {
      const { resetToken, userId } = req.params;
      const auth = await AuthService.findById(userId);
      if (!auth || auth.isVerified) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      auth.isVerified = true;
      await AuthService.save(auth);
      return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.EMAIL_VERIFIED);
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

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Token can not be null"
        );
      }
      const token = refreshToken;
      const secretKey = process.env.REFRESH_TOKEN_SECRET;
      const decoded = await jwt.verify(token, secretKey);

      delete decoded.iat;
      delete decoded.exp;

      if (decoded) {
        const accessToken = generateAccessToken(decoded);
        res.cookie("accessToken", accessToken, { path: "/" });
        if (accessToken) {
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.ACCESS_TOKEN_GENERATED,
            accessToken
          );
        }
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
    } catch (error: any) {
      databaseLogger(error.message);
      if (error instanceof jwt.TokenExpiredError) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          RESPONSE_MESSAGE.LOGIN_AGAIN
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
  }

  async sendEmailForPassWordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const auth = await AuthService.findByEmail(email);
      const user = await UserService.findByEmail(email);
      if (!auth || !user) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const resetToken = crypto.randomBytes(64).toString("hex");
      const resetURL = `http://localhost:8000/api/auth/validate-reset-password/${resetToken}/${auth._id.toString()}`;
      auth.resetPasswordToken = resetToken;
      auth.resetPassword = true;
      auth.resetPasswordExpired = Date.now() + 60 * 60 * 1000;
      await AuthService.save(auth);
      const htmlBody = await ejsRenderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "views",
          "forget-password.ejs"
        ),
        {
          name: user.name,
          resetURL,
        }
      );

      const result = await transporter.sendMail({
        from: "book-heaven@system.com",
        to: `${user.name} ${email}`,
        subject: "Forget Password",
        html: htmlBody,
      });
      if (result.messageId) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.REQUEST_RESET_PASSWORD
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async validateResetPassword(req: Request, res: Response) {
    try {
      const { resetToken, userId } = req.params;
      const auth = await AuthService.findById(userId);
      const wrongURL = "http://localhost:5173/something-went-wrong";
      if (
        !auth ||
        !auth.resetPasswordToken ||
        auth.resetPasswordToken !== resetToken ||
        !auth.resetPassword ||
        (auth.resetPasswordExpired &&
          typeof auth.resetPasswordExpired === "number" &&
          auth.resetPasswordExpired < Date.now())
      ) {
        res.redirect(wrongURL);
        return;
      }

      res.redirect(
        `http://localhost:5173/forget-password/${resetToken}/${userId}`
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      let { password, confirmPassword, resetToken, userId } = req.body;
      const auth = await AuthModel.findOne({ _id: userId });
      if (!auth) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      if (resetToken != auth.resetPasswordToken || !auth) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          "Something went wrong",
          []
        );
      }
      if (password !== confirmPassword) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          "Password and confirm password need to be same",
          []
        );
      }

      if (await bcrypt.compare(password, auth.password)) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          "Your new password and previous password can not be same",
          []
        );
      }
      const hashedPassword = await hashPasswordUsingBcrypt(password);
      auth.password = hashedPassword;
      (auth.resetPasswordToken = null), (auth.resetPasswordExpired = null);
      auth.resetPassword = null;
      await auth.save();
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Reset password successfully",
        []
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
}
const AuthController = new AuthControllerClass();
export { AuthController };
