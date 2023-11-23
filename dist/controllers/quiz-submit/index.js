"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const quiz_submission_1 = require("../../models/quiz-submission");
const quiz_1 = __importDefault(require("../../services/quiz"));
const quiz_submit_1 = __importDefault(require("../../services/quiz-submit"));
const user_1 = __importDefault(require("../../services/user"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const sendValidationError_1 = require("../../utils/sendValidationError");
class QuizSubmissionControllerClass {
    submitQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { quizId } = req.params;
                const { email } = req.user;
                const user = yield user_1.default.findByEmail(email);
                const quizSubmission = req.body;
                const userAns = quizSubmission.answer.map((ele) => ele);
                console.log("user ans", userAns);
                const quiz = yield quiz_1.default.findById(quizId);
                if (!quiz.success || !user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const rightAns = quiz.data.questions.map((ele) => ele.correctAnswer);
                console.log("right ans", rightAns);
                const obtainedMark = quiz_submit_1.default.calculateMarks(userAns, rightAns);
                const quizSubmissionData = {
                    userId: user._id,
                    courseSection: quiz.data.courseSection,
                    quizId: quiz.data._id,
                    answers: userAns,
                    obtainedMarks: obtainedMark,
                };
                const submitAnswer = yield quiz_submit_1.default.submitQuiz(quizSubmissionData);
                if (!submitAnswer.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QUIZ_CREATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QUIZ_CREATE_SUCCESS, submitAnswer.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { quizId } = req.params;
                const quizData = req.body;
                const updatedDoc = yield quiz_1.default.updateQuiz(quizId, quizData);
                if (!updatedDoc.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.QUIZ_UPDATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QUIZ_UPDATE_SUCCESS, updatedDoc.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteQuestionFromQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { quizId, questionId } = req.params;
                const quiz = yield quiz_1.default.findById(quizId);
                if (!quiz.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const deleteQuestionFromQuiz = yield quiz_1.default.deleteQuestion(quizId, questionId);
                if (!deleteQuestionFromQuiz.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.QUESTION_DELETE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QUESTION_DELETE_SUCCESS);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getSubmittedQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId } = req.params;
                const { email } = req.user;
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const submittedQuiz = yield quiz_submission_1.QuizSubmissionModel.findOne({
                    quizId: new mongoose_1.default.Types.ObjectId(quizId),
                    userId: new mongoose_1.default.Types.ObjectId(user._id),
                });
                if (!submittedQuiz) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, submittedQuiz);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const QuizSubmissionController = new QuizSubmissionControllerClass();
exports.default = QuizSubmissionController;
