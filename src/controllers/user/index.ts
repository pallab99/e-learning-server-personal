import dotEnv from "dotenv";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import { publicURL } from "../../constant/user";
import { generateFileName } from "../../helper/generateFileName";
import AuthService from "../../services/auth";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
import mongoose from "mongoose";
import { UserModel } from "../../models/user";
const path = require("path");
const fs = require("fs");
dotEnv.config();
const bucketName = process.env.S3_BUCKET_NAME as string;

class UserControllerClass {
  async getAllUser(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);

      const result = await UserService.getAllUser();
      if (result.length <= 0) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA, []);
      }

      // const userData = await UserService.getDpOfAllUser(result);

      if (!result.length) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG,
          []
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        result
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

  async getUserProfile(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { user } = req;
      const userDetails = await UserService.findByEmail(user.email);
      if (!userDetails) {
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
        userDetails
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

  async updateDp(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;
      const file = req.file;
      if (!req.file) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.UPLOAD_FAILED
        );
      }

      console.log(req.file);

      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      const S3_Bucket_path = `user/dp`;
      const fileName = generateFileName(
        S3_Bucket_path,
        email,
        file.originalname
      );
      console.log(fileName, publicURL);

      const saveFileOnServer = await UserService.saveDpOnServer(
        file,
        fileName,
        user.email
      );
      if (saveFileOnServer.success) {
        user.dp = publicURL + fileName;
        await user.save();
      }

      if (user) {
        return sendResponse(
          res,
          HTTP_STATUS.ACCEPTED,
          RESPONSE_MESSAGE.DP_UPDATED,
          user
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
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

  async deleteUser(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { userId } = req.params;
      const userInUser = await UserService.findById(userId);
      if (!userInUser.success && userInUser.data === null) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      const data = userInUser?.data;
      if (data) {
        const { email } = data;
        const userInAuth = await AuthService.findByEmail(email);
        console.log({ userInAuth });
        if (!userInAuth) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }
        userInAuth.disabled = true;
        const result = await AuthService.save(userInAuth);
        if (result) {
          return sendResponse(
            res,
            HTTP_STATUS.ACCEPTED,
            RESPONSE_MESSAGE.USER_DISABLED,
            userInAuth
          );
        }
      }
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
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

  async getAllInstructor(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const result = await AuthService.getAllInstructor();
      if (!result.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA, []);
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        result.data
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

  async updateUser(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      // const { name, phoneNumber, notificationSetting } = req.body;
      const { email } = req.user;
      const updatedDoc = await UserService.updateUser(email, req.body);
      if (!updatedDoc.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.UPDATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.ACCEPTED,
        RESPONSE_MESSAGE.UPDATE_SUCCESS,
        updatedDoc.data
      );
      console.log(req.body);
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

  async getAllStudents(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const allStudents = await AuthService.getAllStudents();
      if (!allStudents.success) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA, []);
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allStudents.data
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

  async getMyLearning(req: Request, res: Response) {
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

      // const aggregationPipeline = [
      //   {
      //     $match: {
      //       _id: user?._id,
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses",
      //   },
      //   {
      //     $lookup: {
      //       from: "courses",
      //       localField: "enrolledCourses",
      //       foreignField: "_id",
      //       as: "enrolledCourses",
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses",
      //   },
      //   {
      //     $lookup: {
      //       from: "reviewratings",
      //       localField: "enrolledCourses._id",
      //       foreignField: "course",
      //       as: "enrolledCourses.ratings",
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses.ratings",
      //   },
      //   {
      //     $lookup: {
      //       from: "userprogresses",
      //       localField: "enrolledCourses._id",
      //       foreignField: "course",
      //       as: "enrolledCourses.progress",
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses.progress",
      //   },
      //   {
      //     $lookup: {
      //       from: "coursesections",
      //       localField: "enrolledCourses._id",
      //       foreignField: "course",
      //       as: "enrolledCourses.sections",
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses.sections",
      //   },
      //   {
      //     $lookup: {
      //       from: "coursecontents",
      //       localField: "enrolledCourses.sections.sectionContent",
      //       foreignField: "_id",
      //       as: "enrolledCourses.sections.sectionContent",
      //     },
      //   },
      //   {
      //     $unwind: "$enrolledCourses.sections.sectionContent",
      //   },
      //   {
      //     $group: {
      //       _id: "$enrolledCourses._id",
      //       title: { $first: "$enrolledCourses.title" },
      //       level: { $first: "$enrolledCourses.level" },
      //       averageRating: { $avg: "$enrolledCourses.ratings.rating" },
      //       ratingCount: { $sum: 1 },
      //       progress: {
      //         $sum: {
      //           $cond: [
      //             {
      //               $or: [
      //                 {
      //                   $in: [
      //                     "$enrolledCourses.sections.sectionContent._id",
      //                     "$enrolledCourses.progress.completedLessons",
      //                   ],
      //                 },
      //                 {
      //                   $in: [
      //                     "$enrolledCourses.sections.assignment",
      //                     "$enrolledCourses.progress.completedLessons",
      //                   ],
      //                 },
      //                 {
      //                   $in: [
      //                     "$enrolledCourses.sections.quiz",
      //                     "$enrolledCourses.progress.completedLessons",
      //                   ],
      //                 },
      //               ],
      //             },
      //             1,
      //             0,
      //           ],
      //         },
      //       },
      //       totalContent: {
      //         $sum: {
      //           $add: [
      //             {
      //               $cond: [
      //                 { $isArray: "$enrolledCourses.sections.sectionContent" },
      //                 { $size: "$enrolledCourses.sections.sectionContent" },
      //                 0,
      //               ],
      //             },
      //             {
      //               $cond: [
      //                 {
      //                   $ifNull: [
      //                     "$enrolledCourses.sections.assignment",
      //                     false,
      //                   ],
      //                 },
      //                 1,
      //                 0,
      //               ],
      //             },
      //             {
      //               $cond: [
      //                 { $ifNull: ["$enrolledCourses.sections.quiz", false] },
      //                 1,
      //                 0,
      //               ],
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       title: 1,
      //       level: 1,
      //       thumbnail:1,
      //       averageRating: 1,
      //       ratingCount: 1,
      //       progress: {
      //         $cond: {
      //           if: { $ne: ["$totalContent", 0] }, // Check if totalContent is not zero
      //           then: {
      //             $multiply: [{ $divide: ["$progress", "$totalContent"] }, 100],
      //           }, // Perform division
      //           else: 0, // Return 0 if totalContent is zero to avoid division by zero
      //         },
      //       },
      //     },
      //   },
      // ];

      // const myLearnings = await UserModel.aggregate(aggregationPipeline).exec();
      // console.log(myLearnings);

      const myLearning = await UserService.getMyLearning(user._id);
      if (!myLearning.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
          []
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        myLearning
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

export const UserController = new UserControllerClass();
