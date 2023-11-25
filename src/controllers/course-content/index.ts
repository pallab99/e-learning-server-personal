import { Request, Response } from "express";
import mongoose from "mongoose";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseContentModel from "../../models/course-content/courseContent";
import CourseService from "../../services/course";
import CourseContentService from "../../services/course-content";
import CourseSectionService from "../../services/course-section";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
class CourseContentClass {
  async createCourseContent(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId } = req.params;
      const { title } = req.body;
      const courseDoc = await CourseService.findById(courseId);
      const courseSectionDoc = await CourseSectionService.findById(sectionId);

      if (
        !courseDoc.success ||
        !courseSectionDoc.success ||
        !Object.keys(courseDoc.data).length
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const courseTitle = courseDoc.data?.title;
      const sectionTitle = courseSectionDoc.data?.title;
      const file = req.file;
      console.log("file", file);
      const result = await CourseContentService.saveFileOnServer(
        file,
        courseTitle,
        sectionTitle
      );
      if (!result.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.S3_SERVER_ERROR
        );
      }
      const contentDuration = await CourseContentService.getVideoDuration(file);

      const doc = await CourseContentModel.create({
        contentTitle: title,
        contentUrl: result.data,
        contentLength: contentDuration,
        course: courseId,
        courseSection: sectionId,
      });

      const allContent =
        await CourseContentService.getAllCourseContentBySectionId(sectionId);

      if (!allContent.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      const updateTotalContent = await CourseSectionService.updateTotalContent(
        sectionId,
        allContent.data
      );
      const saveContentId = await CourseSectionService.saveCourseContentId(
        sectionId,
        doc._id
      );

      if (!saveContentId.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.ACCEPTED,
        RESPONSE_MESSAGE.S3_SERVER_SUCCESS,
        doc
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

  async deleteCourseContent(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId, contentId } = req.params;
      const courseDoc = await CourseService.findById(courseId);
      const courseSectionDoc = await CourseSectionService.findById(sectionId);
      const courseContentDoc = await CourseContentService.findById(contentId);

      if (
        !courseDoc.success ||
        !courseSectionDoc.success ||
        !courseContentDoc.success
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const deleteContentFromSection =
        await CourseSectionService.deleteCourseContentFromSection(
          sectionId,
          contentId
        );
      if (!deleteContentFromSection?.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.DELETE_FAILED
        );
      }
      const deleteDoc = await CourseContentService.findByIdAndDelete(contentId);
      if (!deleteDoc.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.DELETE_FAILED
        );
      }
      return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.DELETE_SUCCESS);
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

  async updateCourseContent(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { contentId } = req.params;
      const content = await CourseContentService.findById(contentId);
      const course = await CourseService.findById(content?.data?.course);
      const section = await CourseSectionService.findById(
        content?.data?.courseSection
      );
      console.log({ course });

      if (!content.success || !course.success || !section.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const body = req.body;
      console.log(body);
      console.log(req.file);

      if (req.file) {
        const result = await CourseContentService.saveFileOnServer(
          req.file,
          course.data.title,
          section.data.title
        );
        const contentDuration = await CourseContentService.getVideoDuration(
          req.file
        );

        if (!result.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.S3_SERVER_ERROR
          );
        }
        const updatedDoc = await CourseContentModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(contentId) },
          {
            contentTitle: req.body.title,
            contentUrl: result.data,
            contentLength: contentDuration,
          }
        );
        console.log("updated doc", updatedDoc);

        if (!updatedDoc) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }

        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.UPDATE_SUCCESS
        );
      } else {
        const updatedDoc = await CourseContentModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(contentId) },
          { contentTitle: req.body.title }
        );

        if (!updatedDoc) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
          );
        }

        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.UPDATE_SUCCESS
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

  async disableCourseContent(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { contentId } = req.params;
      const content = await CourseContentService.findById(contentId);
      if (!content.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const updateDoc = await CourseContentModel.updateOne(
        { _id: new mongoose.Types.ObjectId(contentId) },
        { $set: { disable: true } }
      );

      if (!updateDoc.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
        );
      }

      return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.DELETE_SUCCESS);
      
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

const CourseContentController = new CourseContentClass();

export default CourseContentController;
