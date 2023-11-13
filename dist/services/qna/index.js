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
const qna_1 = __importDefault(require("../../repository/qna"));
class QNAServiceClass {
    findQNAByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.findQNAByCourseId(courseId);
            return { success: result ? true : false, data: result };
        });
    }
    createQNA(message, courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.createQNA(message, courseId, userId);
            console.log(result);
            return { success: result ? true : false, data: result };
        });
    }
    addToExistingQNA(message, courseId, userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.findQNAByCourseId(courseId);
            (_a = result === null || result === void 0 ? void 0 : result.messages) === null || _a === void 0 ? void 0 : _a.push({ message: message, user: userId, reply: [] });
            const newMessage = yield (result === null || result === void 0 ? void 0 : result.save());
            return { success: result ? true : false, data: newMessage };
        });
    }
    replyToQuestion(questionId, userId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const replyData = {
                message: reply,
                user: userId,
                likes: 0,
            };
            const result = yield qna_1.default.replyToQuestion(questionId, replyData);
            return { success: result ? true : false, data: result };
        });
    }
    updateQuestion(questionId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.updateQuestion(questionId, message);
            return { success: result ? true : false, data: result };
        });
    }
    updateReply(questionId, replyId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.updateReply(questionId, replyId, message);
            return { success: result ? true : false, data: result };
        });
    }
    deleteQuestion(qnaId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.deleteQuestion(qnaId, questionId);
            return { success: result ? true : false, data: result };
        });
    }
    deleteReply(qnaId, questionId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield qna_1.default.deleteReply(qnaId, questionId, replyId);
            return { success: result ? true : false, data: result };
        });
    }
}
const QNAService = new QNAServiceClass();
exports.default = QNAService;
