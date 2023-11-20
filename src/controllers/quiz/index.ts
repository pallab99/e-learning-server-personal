import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseSectionService from "../../services/course-section";
import QuizService from "../../services/quiz";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
class QuizControllerClass {
  async createQuiz(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const quizData = req.body;
      console.log("quiz data", quizData);

      const newQuiz = await QuizService.createQuiz(quizData);
      if (!newQuiz.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.QUIZ_CREATE_FAILED
        );
      }
      const addQuizInTheSection = await CourseSectionService.addQuiz(
        newQuiz.data._id,
        req.body.courseSection
      );
      console.log(addQuizInTheSection);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QUIZ_CREATE_SUCCESS,
        newQuiz.data
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

  async updateQuiz(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { quizId } = req.params;
      const quizData = req.body;
      const updatedDoc = await QuizService.updateQuiz(quizId, quizData);
      if (!updatedDoc.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.QUIZ_UPDATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QUIZ_UPDATE_SUCCESS,
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

  async deleteQuestionFromQuiz(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();

      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { quizId, questionId } = req.params;
      const quiz = await QuizService.findById(quizId);
      if (!quiz.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const deleteQuestionFromQuiz = await QuizService.deleteQuestion(
        quizId,
        questionId
      );
      if (!deleteQuestionFromQuiz.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.QUESTION_DELETE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QUESTION_DELETE_SUCCESS
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

const QuizController = new QuizControllerClass();
export default QuizController;
