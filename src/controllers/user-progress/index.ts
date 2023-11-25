import { Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import UserProgressModel from "../../models/user-progress";
import UserService from "../../services/user";
import UserProgressService from "../../services/user-progress";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import mongoose from "mongoose";
import { log } from "console";
import CourseSectionModel from "../../models/course-section";

class UserProgressController {
  async createUserProgress(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;
      const { courseId, contentId } = req.body;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const userProgressAvailable = await UserProgressModel.findOne({
        student: user?._id,
        course: courseId,
      });
      if (!userProgressAvailable) {
        const newUserProgress = await UserProgressService.create(
          user?._id,
          courseId,
          contentId
        );
        if (!newUserProgress.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.USER_PROGRESS_UPDATED,
          newUserProgress.data
        );
      } else {
        const updateUserProgress = await UserProgressService.update(
          user?._id,
          courseId,
          contentId
        );
        if (!updateUserProgress.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.USER_PROGRESS_UPDATED,
          updateUserProgress.data
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
  async getUserProgress(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;
      const { courseId } = req.params;
      const user = await UserService.findByEmail(email);

      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const userProgressPipeline = [
        {
          $match: {
            student: new mongoose.Types.ObjectId(user._id),
            course: new mongoose.Types.ObjectId(courseId),
          },
        },
        {
          $lookup: {
            from: "coursesections",
            let: { courseId: new mongoose.Types.ObjectId(courseId) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$course", "$$courseId"],
                  },
                },
              },
              {
                $project: {
                  totalItems: {
                    $add: [
                      { $size: "$sectionContent" },
                      { $cond: [{ $ifNull: ["$assignment", false] }, 1, 0] },
                      { $cond: [{ $ifNull: ["$quiz", false] }, 1, 0] },
                    ],
                  },
                },
              },
            ],
            as: "courseSections",
          },
        },
        {
          $unwind: "$courseSections",
        },
        {
          $group: {
            _id: "$_id",
            totalContents: { $sum: "$courseSections.totalItems" },
            completedContents: { $first: { $size: "$completedLessons" } },
            userProgressObject: { $first: "$$ROOT" },
          },
        },
        {
          $project: {
            userProgressObject: 1,
            progressPercentage: {
              $cond: [
                { $eq: ["$totalContents", 0] },
                0,
                {
                  $multiply: [
                    { $divide: ["$completedContents", "$totalContents"] },
                    100,
                  ],
                },
              ],
            },
            totalContents: "$totalContents",
          },
        },
        {
          $addFields: {
            "userProgressObject.progressPercentage": "$progressPercentage",
            "userProgressObject.totalContents": "$totalContents",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$userProgressObject",
          },
        },
      ];

      const userProgressResult =
        await UserProgressModel.aggregate(userProgressPipeline);

      if (!userProgressResult || userProgressResult.length === 0) {
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
        userProgressResult[0]
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

export default new UserProgressController();
