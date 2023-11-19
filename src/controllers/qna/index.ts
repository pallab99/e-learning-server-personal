import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseService from "../../services/course";
import QNAService from "../../services/qna";
import UserService from "../../services/user";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
import { QNAModel } from "../../models/QNA";
import mongoose from "mongoose";
import { populate } from "dotenv";
class QNAControllerClass {
  async getAllQNQOfACourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const qnas = await QNAModel.findOne({
        course: new mongoose.Types.ObjectId(courseId),
      })
        .populate("messages.user" ,"_id name email dp")
        .populate("messages.reply.user" ,"_id name email dp");
      if (!qnas) {
        return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.NO_DATA, []);
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        qnas
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
  async addQuestion(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId, message } = req.body;
      const { email } = req.user;
      const course = await CourseService.findById(courseId);

      const user = await UserService.findByEmail(email);
      if (!user || !course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const qnaExists = await QNAService.findQNAByCourseId(courseId);
      if (!qnaExists.success) {
        const newQNA = await QNAService.createQNA(message, courseId, user._id);

        if (!newQNA.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.QNA_ADDED_FAILED
          );
        }
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.QNA_ADDED_SUCCESS,
          newQNA.data
        );
      } else {
        const existingQNA = await QNAService.addToExistingQNA(
          message,
          courseId,
          user._id
        );
        if (!existingQNA.success) {
          return sendResponse(
            res,
            HTTP_STATUS.BAD_REQUEST,
            RESPONSE_MESSAGE.QNA_ADDED_FAILED
          );
        }
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.QNA_ADDED_SUCCESS,
          existingQNA.data
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

  async replyToQuestion(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId, reply } = req.body;
      const { questionId } = req.params;
      const { email } = req.user;
      const course = await CourseService.findById(courseId);

      const user = await UserService.findByEmail(email);
      if (!user || !course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const qnaExists = await QNAService.findQNAByCourseId(courseId);
      if (!qnaExists.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const addReply = await QNAService.replyToQuestion(
        questionId,
        user._id,
        reply
      );
      if (!addReply.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.REPLY_FAIL
        );
      }
      return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.REPLY_SUCCESS);
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

  async updateQuestion(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId, questionId } = req.params;
      const { question } = req.body;
      const course = await CourseService.findById(courseId);
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user || !course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const updateQuestion = await QNAService.updateQuestion(
        questionId,
        question
      );
      if (!updateQuestion.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.QNA_UPDATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QNA_UPDATE_SUCCESS
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
  async updateReply(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { courseId, questionId, replyId } = req.params;
      const { reply } = req.body;
      const course = await CourseService.findById(courseId);
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user || !course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const updateReply = await QNAService.updateReply(
        questionId,
        replyId,
        reply
      );
      if (!updateReply.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.QNA_UPDATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QNA_UPDATE_SUCCESS
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

  async deleteQuestion(req: Request, res: Response) {
    databaseLogger(req.originalUrl);
    const validation = validationResult(req).array();
    if (validation.length) {
      return sendValidationError(res, validation);
    }
    const { courseId, questionId, qnaId } = req.params;
    const course = await CourseService.findById(courseId);
    const { email } = req.user;
    const user = await UserService.findByEmail(email);
    if (!user || !course.success) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGE.NO_DATA);
    }

    const deleteQuestion = await QNAService.deleteQuestion(qnaId, questionId);
    if (!deleteQuestion.success) {
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
      );
    }

    return sendResponse(
      res,
      HTTP_STATUS.OK,
      RESPONSE_MESSAGE.QUESTION_DELETE_SUCCESS
    );
  }

  async deleteReply(req: Request, res: Response) {
    databaseLogger(req.originalUrl);
    const validation = validationResult(req).array();
    if (validation.length) {
      return sendValidationError(res, validation);
    }
    const { courseId, questionId, qnaId, replyId } = req.params;
    const course = await CourseService.findById(courseId);
    const { email } = req.user;
    const user = await UserService.findByEmail(email);
    if (!user || !course.success) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGE.NO_DATA);
    }

    const deleteQuestion = await QNAService.deleteReply(
      qnaId,
      questionId,
      replyId
    );
    if (!deleteQuestion.success) {
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGE.SOMETHING_WENT_WRONG
      );
    }

    return sendResponse(
      res,
      HTTP_STATUS.OK,
      RESPONSE_MESSAGE.REPLY_DELETE_SUCCESS
    );
  }
}

const QNAController = new QNAControllerClass();
export default QNAController;
