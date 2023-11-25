import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import { publicURL } from "../../constant/user";
import { buildMatchStage } from "../../helper/allcoursePipelinebuilder";
import { generateFileName } from "../../helper/generateFileName";
import CourseModel from "../../models/course";
import CourseService from "../../services/course";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
const jwt = require("jsonwebtoken");
const bucketName = process.env.S3_BUCKET_NAME;
class CourseControllerClass {
  async createCourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }

      const body = req.body;
      console.log(body);

      const { email } = req.user;
      const findByTitle = await CourseService.findByTitle(body.title);

      if (findByTitle.success) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGE.COURSE_TITLE
        );
      }
      const instructor = await UserService.findByEmail(email);
      if (!instructor) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      let instructorId = [];
      instructorId.push(instructor._id);
      // const newCategory = new mongoose.Types.ObjectId(body.category);
      const newCourse = await CourseModel.create(body);
      newCourse.instructors.push(instructor._id);
      await newCourse.save();
      console.log(newCourse);
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

      const aggregationPipeline: mongoose.PipelineStage[] = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(courseId),
          },
        },

        {
          $lookup: {
            from: "reviewratings",
            localField: "_id",
            foreignField: "course",
            as: "reviews",
          },
        },

        {
          $lookup: {
            from: "users", // Assuming "users" is the collection for the User model
            localField: "instructors",
            foreignField: "_id",
            as: "instructors",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $addFields: {
            rating: {
              $cond: {
                if: { $gt: [{ $size: "$reviews" }, 0] },
                then: { $avg: "$reviews.rating" },
                else: 0,
              },
            },
            ratingCount: {
              $size: "$reviews",
            },
          },
        },

        {
          $project: {
            title: 1,
            thumbnail: 1,
            rating: 1,
            ratingCount: 1,
            level: 1,
            createdAt: 1,
            updatedAt: 1,
            students: 1,
            sub_title: 1,
            instructors: 1,
            demoVideo: 1,
            description: 1,
            prerequisites: 1,
            benefits: 1,
            category: 1,
          },
        },
      ];
      const courses = await CourseModel.aggregate(aggregationPipeline).exec();

      const course = await CourseModel.findOne({ _id: courseId })
        .populate("instructors")
        .populate("category", "_id title");
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
        ...courses
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
        sortValue,
      } = req.query;

      const query: any = {};
      const token = req?.cookies?.accessToken;
      // Pagination
      if (token) {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const validate = jwt.verify(token, secretKey);

        if (validate.rank === 1) {
          console.log("admin");
          if (!type || !value) {
            const result = await CourseModel.find();

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
          } else if (type || value) {
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
        } else {
          const pageNumber = parseInt(page as string) || 1;
          const pageSize = parseInt(limit as string) || 10;
          const skip = (pageNumber - 1) * pageSize;
          const filterCategoryArray = filterCategory
            ? (filterCategory as string).split(",")
            : [];

          const matchStage: any = buildMatchStage(
            search as string,
            instructors as string[],
            category as string,
            filterCategoryArray as string[],
            filterLevel as string,
            filterTotalHours as string
          );

          const aggregationPipeline: mongoose.PipelineStage[] = [
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $match: {
                ...matchStage,
                verified: true,
              },
            },
            {
              $lookup: {
                from: "reviewratings",
                localField: "_id",
                foreignField: "course",
                as: "reviews",
              },
            },
            {
              $addFields: {
                rating: {
                  $cond: {
                    if: { $gt: [{ $size: "$reviews" }, 0] },
                    then: { $avg: "$reviews.rating" },
                    else: 0,
                  },
                },
                ratingCount: {
                  $size: "$reviews",
                },
              },
            },
            {
              $project: {
                title: 1,
                thumbnail: 1,
                rating: 1,
                ratingCount: 1,
                level: 1,
                createdAt: 1,
                updatedAt: 1,
                students: 1,
                category: {
                  $cond: {
                    if: { $ifNull: ["$category", false] },
                    then: { $arrayElemAt: ["$category.title", 0] },
                    else: null,
                  },
                },
              },
            },
          ];

          // const result: any = await CourseModel.aggregate(aggregationPipeline);

          if (sortValue === "student") {
            aggregationPipeline.push({
              $sort: {
                studentsCount: -1,
              },
            });
          } else if (sortValue === "latest") {
            aggregationPipeline.push({
              $sort: {
                createdAt: -1,
              },
            });
          } else if (sortValue === "updated") {
            aggregationPipeline.push({
              $sort: {
                updatedAt: -1,
              },
            });
          } else if (sortValue === "rating") {
            aggregationPipeline.push({
              $sort: {
                rating: -1,
              },
            });
          }

          aggregationPipeline.push({ $skip: skip }, { $limit: pageSize });

          const courses =
            await CourseModel.aggregate(aggregationPipeline).exec();

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
        }
      } else {
        const pageNumber = parseInt(page as string) || 1;
        const pageSize = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * pageSize;
        const filterCategoryArray = filterCategory
          ? (filterCategory as string).split(",")
          : [];

        const matchStage: any = buildMatchStage(
          search as string,
          instructors as string[],
          category as string,
          filterCategoryArray as string[],
          filterLevel as string,
          filterTotalHours as string
        );

        const aggregationPipeline: mongoose.PipelineStage[] = [
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $match: {
              ...matchStage,
              verified: true,
            },
          },
          {
            $lookup: {
              from: "reviewratings",
              localField: "_id",
              foreignField: "course",
              as: "reviews",
            },
          },
          {
            $addFields: {
              rating: {
                $cond: {
                  if: { $gt: [{ $size: "$reviews" }, 0] },
                  then: { $avg: "$reviews.rating" },
                  else: 0,
                },
              },
              ratingCount: {
                $size: "$reviews",
              },
            },
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              rating: 1,
              ratingCount: 1,
              level: 1,
              createdAt: 1,
              updatedAt: 1,
              students: 1,
              category: {
                $cond: {
                  if: { $ifNull: ["$category", false] },
                  then: { $arrayElemAt: ["$category.title", 0] },
                  else: null,
                },
              },
            },
          },
        ];

        if (sortValue === "student") {
          aggregationPipeline.push({
            $sort: {
              studentsCount: -1,
            },
          });
        } else if (sortValue === "latest") {
          aggregationPipeline.push({
            $sort: {
              createdAt: -1,
            },
          });
        } else if (sortValue === "updated") {
          aggregationPipeline.push({
            $sort: {
              updatedAt: -1,
            },
          });
        } else if (sortValue === "rating") {
          aggregationPipeline.push({
            $sort: {
              rating: -1,
            },
          });
        }

        aggregationPipeline.push({ $skip: skip }, { $limit: pageSize });

        const courses = await CourseModel.aggregate(aggregationPipeline).exec();

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

  async updateCourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const body = req.body;
      const files = req.files;
      const { courseId } = req.params;

      const newCourse = await CourseModel.findOneAndUpdate(
        { _id: courseId },
        body,
        {
          new: true,
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.CREATED,
        RESPONSE_MESSAGE.COURSE_UPDATED,
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
      const { searchTerm } = req.query;
      console.log(searchTerm);

      const instructor = await UserService.findByEmail(email);
      if (!instructor) {
        return await sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const courseByInstructor = await CourseService.getCourseByInstructor(
        instructor?._id,
        searchTerm
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
      const { type } = req.query;
      if (type === "reject") {
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

  async uploadDemoVideo(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const file = req.file;
      if (!req.file) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.UPLOAD_FAILED
        );
      }
      const S3_Bucket_path = `user/dp`;
      const fileName = generateFileName(
        S3_Bucket_path,
        course.data.title,
        file.originalname
      );
      console.log(fileName, publicURL);

      const saveFileOnServer = await UserService.saveDpOnServer(
        file,
        fileName,
        course.data.title
      );
      if (saveFileOnServer.success) {
        const uploadDemoVideo = await CourseModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { demoVideo: publicURL + fileName }
        );
        if (uploadDemoVideo) {
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.S3_SERVER_SUCCESS
          );
        }
      }
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.UPLOAD_FAILED
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

  async uploadThumbnail(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const file = req.file;
      if (!req.file) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.UPLOAD_FAILED
        );
      }
      const S3_Bucket_path = `user/dp`;
      const fileName = generateFileName(
        S3_Bucket_path,
        course.data.title,
        file.originalname
      );
      console.log(fileName, publicURL);

      const saveFileOnServer = await UserService.saveDpOnServer(
        file,
        fileName,
        course.data.title
      );
      if (saveFileOnServer.success) {
        const uploadDemoVideo = await CourseModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { thumbnail: publicURL + fileName }
        );
        if (uploadDemoVideo) {
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            RESPONSE_MESSAGE.S3_SERVER_SUCCESS
          );
        }
      }
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.UPLOAD_FAILED
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

  // async userEnrolledInCourse(req:Request,res:Response)
  async requestForCoursePublish(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const course = await CourseModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(courseId) },
        { verified: false }
      );
      if (!course?.isModified) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.SUBMIT_REQUEST_COURSE_PUBLICATION
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

  async courseBoughtByStudent(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);

      const { courseId } = req.params;
      const { email } = req.user;
      const course = await CourseService.findById(courseId);
      const user = await UserService.findByEmail(email);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const userBoughtTheCourse = await CourseModel.findOne({
        _id: new mongoose.Types.ObjectId(courseId),
        students: { $in: [user?._id] },
      });

      if (!userBoughtTheCourse) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
          {}
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        userBoughtTheCourse
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
