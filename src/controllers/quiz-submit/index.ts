import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import { QuizSubmissionModel } from "../../models/quiz-submission";
import QuizService from "../../services/quiz";
import QuizSubmitService from "../../services/quiz-submit";
import UserService from "../../services/user";
import { IQuizSubmissionData } from "../../types/quizSubmission";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import { sendValidationError } from "../../utils/sendValidationError";
class QuizSubmissionControllerClass {
  async submitQuiz(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const validation = validationResult(req).array();
      if (validation.length) {
        return sendValidationError(res, validation);
      }
      const { quizId } = req.params;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      const quizSubmission = req.body;
      const userAns = quizSubmission.answer.map((ele: any) => ele);
      console.log("user ans", userAns);

      const quiz = await QuizService.findById(quizId);
      if (!quiz.success || !user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const rightAns = quiz.data.questions.map((ele: any) => ele.correctAnswer);
      console.log("right ans", rightAns);

      const obtainedMark = QuizSubmitService.calculateMarks(userAns, rightAns);
      const quizSubmissionData: IQuizSubmissionData = {
        userId: user._id,
        courseSection: quiz.data.courseSection,
        quizId: quiz.data._id,
        answers: userAns,
        obtainedMarks: obtainedMark,
      };
      const submitAnswer =
        await QuizSubmitService.submitQuiz(quizSubmissionData);
      if (!submitAnswer.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.QUIZ_CREATE_FAILED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.QUIZ_CREATE_SUCCESS,
        submitAnswer.data
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

  async getSubmittedQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const { email } = req.user;
      const user = await UserService.findByEmail(email);
      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const submittedQuiz = await QuizSubmissionModel.findOne({
        quizId: new mongoose.Types.ObjectId(quizId),
        userId: new mongoose.Types.ObjectId(user._id),
      });
      if (!submittedQuiz) {
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
        submittedQuiz
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

const QuizSubmissionController = new QuizSubmissionControllerClass();
export default QuizSubmissionController;
