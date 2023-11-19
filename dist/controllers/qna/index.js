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
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const course_1 = __importDefault(require("../../services/course"));
const qna_1 = __importDefault(require("../../services/qna"));
const user_1 = __importDefault(require("../../services/user"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const sendValidationError_1 = require("../../utils/sendValidationError");
const QNA_1 = require("../../models/QNA");
const mongoose_1 = __importDefault(require("mongoose"));
class QNAControllerClass {
    getAllQNQOfACourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.params;
                const qnas = yield QNA_1.QNAModel.findOne({
                    course: new mongoose_1.default.Types.ObjectId(courseId),
                })
                    .populate("messages.user", "_id name email dp")
                    .populate("messages.reply.user", "_id name email dp");
                if (!qnas) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, qnas);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    addQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { courseId, message } = req.body;
                const { email } = req.user;
                const course = yield course_1.default.findById(courseId);
                const user = yield user_1.default.findByEmail(email);
                if (!user || !course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const qnaExists = yield qna_1.default.findQNAByCourseId(courseId);
                if (!qnaExists.success) {
                    const newQNA = yield qna_1.default.createQNA(message, courseId, user._id);
                    if (!newQNA.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.QNA_ADDED_FAILED);
                    }
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QNA_ADDED_SUCCESS, newQNA.data);
                }
                else {
                    const existingQNA = yield qna_1.default.addToExistingQNA(message, courseId, user._id);
                    if (!existingQNA.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.QNA_ADDED_FAILED);
                    }
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QNA_ADDED_SUCCESS, existingQNA.data);
                }
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    replyToQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { courseId, reply } = req.body;
                const { questionId } = req.params;
                const { email } = req.user;
                const course = yield course_1.default.findById(courseId);
                const user = yield user_1.default.findByEmail(email);
                if (!user || !course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const qnaExists = yield qna_1.default.findQNAByCourseId(courseId);
                if (!qnaExists.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const addReply = yield qna_1.default.replyToQuestion(questionId, user._id, reply);
                if (!addReply.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.REPLY_FAIL);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.REPLY_SUCCESS);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { courseId, questionId } = req.params;
                const { question } = req.body;
                const course = yield course_1.default.findById(courseId);
                const { email } = req.user;
                const user = yield user_1.default.findByEmail(email);
                if (!user || !course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const updateQuestion = yield qna_1.default.updateQuestion(questionId, question);
                if (!updateQuestion.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.QNA_UPDATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QNA_UPDATE_SUCCESS);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { courseId, questionId, replyId } = req.params;
                const { reply } = req.body;
                const course = yield course_1.default.findById(courseId);
                const { email } = req.user;
                const user = yield user_1.default.findByEmail(email);
                if (!user || !course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const updateReply = yield qna_1.default.updateReply(questionId, replyId, reply);
                if (!updateReply.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.QNA_UPDATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QNA_UPDATE_SUCCESS);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, dbLogger_1.databaseLogger)(req.originalUrl);
            const validation = (0, express_validator_1.validationResult)(req).array();
            if (validation.length) {
                return (0, sendValidationError_1.sendValidationError)(res, validation);
            }
            const { courseId, questionId, qnaId } = req.params;
            const course = yield course_1.default.findById(courseId);
            const { email } = req.user;
            const user = yield user_1.default.findByEmail(email);
            if (!user || !course.success) {
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
            }
            const deleteQuestion = yield qna_1.default.deleteQuestion(qnaId, questionId);
            if (!deleteQuestion.success) {
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
            }
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.QUESTION_DELETE_SUCCESS);
        });
    }
    deleteReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, dbLogger_1.databaseLogger)(req.originalUrl);
            const validation = (0, express_validator_1.validationResult)(req).array();
            if (validation.length) {
                return (0, sendValidationError_1.sendValidationError)(res, validation);
            }
            const { courseId, questionId, qnaId, replyId } = req.params;
            const course = yield course_1.default.findById(courseId);
            const { email } = req.user;
            const user = yield user_1.default.findByEmail(email);
            if (!user || !course.success) {
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
            }
            const deleteQuestion = yield qna_1.default.deleteReply(qnaId, questionId, replyId);
            if (!deleteQuestion.success) {
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
            }
            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.REPLY_DELETE_SUCCESS);
        });
    }
}
const QNAController = new QNAControllerClass();
exports.default = QNAController;
