import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseService from "../../services/course";
import CourseSectionService from "../../services/course-section";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
import UserService from "../../services/user";
import CourseSectionModel from "../../models/course-section";
const jwt = require("jsonwebtoken");

class CourseSectionClass {
  async getCourseSection(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;

      const fetchCourseContent = async (courseId: string) => {
        const courseContent =
          await CourseSectionService.courseContentForNonSubscribedStudent(
            courseId
          );
        if (!courseContent.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }
        return courseContent;
      };

      if (req?.cookies?.accessToken) {
        const { accessToken } = req.cookies;
        const token = accessToken;
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);
        const user = await UserService.findByEmail(validate?.email);
        if (!user) {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            RESPONSE_MESSAGE.NO_DATA
          );
        }

        const userEnrolledInCourse = await CourseService.userEnrolledInCourse(
          courseId,
          user._id
        );
        if (!userEnrolledInCourse.success && validate.rank === 3) {
          const courseContentForNonSubscribedStudent =
            await fetchCourseContent(courseId);
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
            courseContentForNonSubscribedStudent?.data
          );
        } else {
          const result =
            await CourseSectionService.getCourseSectionByCourseId(courseId);
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
            result.data
          );
        }
      } else {
        const courseContentForNonSubscribedStudent =
          await fetchCourseContent(courseId);
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
          courseContentForNonSubscribedStudent?.data
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
  async createCourseSection(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId } = req.params;
      const { title } = req.body;
      const course = await CourseService.findById(courseId);

      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const result = await CourseSectionService.createSection(title, courseId);
      if (!result.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.ACCEPTED,
        RESPONSE_MESSAGE.COURSE_SECTION_CREATED,
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

  async updateCourseSection(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { title, isVisible } = req.body;
      const { courseId, courseSectionId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const updatedDoc = await CourseSectionService.updateSection(
        courseSectionId,
        {
          title,
          isVisible,
        }
      );
      if (!updatedDoc.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.ACCEPTED,
        RESPONSE_MESSAGE.UPDATE_SUCCESS,
        updatedDoc.data
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

  async deleteCourseSection(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, courseSectionId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const deletedSection =
        await CourseSectionService.deleteSection(courseSectionId);
      if (!deletedSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.ACCEPTED,
        RESPONSE_MESSAGE.DELETE_SUCCESS,
        deletedSection.data
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

  async changeVisibility(req: Request, res: Response) {
    try {
      const { courseId, courseSectionId } = req.params;
      const course = await CourseService.findById(courseId);
      const {type} = req.query;
      console.log(type);

      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      let result;
      if (type === "enable") {
        console.log("enable");
        
        result = await CourseSectionModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(courseSectionId) },
          { isVisible: 1 }
        );
      } else {
        result = await CourseSectionModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(courseSectionId) },
          { isVisible: 0 }
        );
        console.log("disable");

      }
      if (!result) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      if (type.toString() === "enable") {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.COURSE_SECTION_ENABLED,
          result
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.COURSE_SECTION_DISABLED,
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
}

const CourseSectionController = new CourseSectionClass();
export default CourseSectionController;
