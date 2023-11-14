import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import { buildMatchStage } from "../../helper/allcoursePipelinebuilder";
import CourseModel from "../../models/course";
import CourseService from "../../services/course";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
import mongoose from "mongoose";
const bucketName = process.env.S3_BUCKET_NAME;
class CourseControllerClass {
  async createCourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const files = req.files;
      const body = req.body;
      const findByTitle = await CourseService.findByTitle(body.title);

      if (findByTitle.success) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGE.COURSE_TITLE
        );
      }
      const newCourse = await CourseModel.create(body);
      const result = await CourseService.saveFilesOnServer(
        files,
        body,
        newCourse
      );
      console.log("s3 server", result);

      CourseService.save(newCourse);
      return sendResponse(
        res,
        HTTP_STATUS.CREATED,
        RESPONSE_MESSAGE.COURSE_CREATED,
        newCourse
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

  async getCourseById(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const course = await CourseModel.findOne({ _id: courseId }).populate(
        "instructors"
      );
      if (!course) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA,
          []
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
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

  async getAllCourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const {
        page,
        limit,
        search,
        instructors,
        category,
        filterCategory,
        filterLevel,
        filterTotalHours,
        type,
        value,
      } = req.query;

      const query: any = {};

      // Pagination
      if (type || value) {
        console.log({ type, value });

        if (type === "disable") {
          const result = await CourseModel.find({ disable: true });

          if (!result) {
            return sendResponse(
              res,
              HTTP_STATUS.OK,
              RESPONSE_MESSAGE.NO_DATA,
              []
            );
          }
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
            {
              courses: result,
            }
          );
        }
        if (type === "verified" && value === "true") {
          const result = await CourseModel.find({ verified: true });

          if (!result) {
            return sendResponse(
              res,
              HTTP_STATUS.OK,
              RESPONSE_MESSAGE.NO_DATA,
              []
            );
          }
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
            {
              courses: result,
            }
          );
        }
        if (type === "verified" && value === "false") {
          console.log("hello");

          const result = await CourseModel.find({ verified: "false" });

          if (!result) {
            return sendResponse(
              res,
              HTTP_STATUS.OK,
              RESPONSE_MESSAGE.NO_DATA,
              []
            );
          }
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
            {
              courses: result,
            }
          );
        }
      }
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const matchStage: any = buildMatchStage(
        search as string,
        instructors as string[],
        category as string,
        filterCategory as string,
        filterLevel as string,
        filterTotalHours as string
      );

      const aggregation = [
        { $match: matchStage },
        { $skip: skip },
        { $limit: pageSize },
      ];

      const courses = await CourseModel.aggregate(aggregation);

      const totalCourses = await CourseModel.countDocuments(matchStage);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        {
          courses,
          totalCourses,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCourses / pageSize),
        }
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

  async updateCourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const body = req.body;
      const files = req.files;
      const { courseId } = req.params;
      const findByTitle = await CourseService.findByTitle(body.title);

      if (findByTitle.success) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGE.COURSE_TITLE
        );
      }
      const newCourse = await CourseModel.findByIdAndUpdate(courseId, body, {
        new: true,
      });
      const result = await CourseService.saveFilesOnServer(
        files,
        body,
        newCourse
      );

      CourseService.save(newCourse);
      return sendResponse(
        res,
        HTTP_STATUS.CREATED,
        RESPONSE_MESSAGE.COURSE_CREATED,
        newCourse
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

  async getCourseByInstructor(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { email } = req.user;

      const instructor = await UserService.findByEmail(email);
      if (!instructor) {
        return await sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const courseByInstructor = await CourseService.getCourseByInstructor(
        instructor?._id
      );

      if (!courseByInstructor.success) {
        return await sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.NO_DATA,
          []
        );
      }
      return await sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        courseByInstructor.data
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

  async acceptCourseRequest(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const {type}=req.query
      if(type==="reject"){
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.REJECT_COURSE_REQUEST
        );
      }
      const result = await CourseModel.updateOne(
        { _id: new mongoose.Types.ObjectId(courseId) },
        { $set: { verified: true } }
      );
      if (!result) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ACCEPT_COURSE_REQUEST
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

const CourseController = new CourseControllerClass();

export default CourseController;
