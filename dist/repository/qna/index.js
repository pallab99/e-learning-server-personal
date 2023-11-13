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
const mongoose_1 = __importDefault(require("mongoose"));
const QNA_1 = require("../../models/QNA");
class QNARepositoryClass {
    findQNAByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.findOne({
                course: new mongoose_1.default.Types.ObjectId(courseId),
            });
        });
    }
    createQNA(message, courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.create({
                course: courseId,
                messages: [
                    {
                        message: message,
                        user: userId,
                        reply: [],
                    },
                ],
            });
        });
    }
    replyToQuestion(questionId, replyData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.updateOne({ "messages._id": questionId }, { $push: { "messages.$.reply": replyData } });
        });
    }
    updateQuestion(questionId, question) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.updateOne({ "messages._id": questionId }, { $set: { "messages.$.message": question } }, { new: true });
        });
    }
    updateReply(questionId, replyId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.updateOne({ "messages._id": questionId }, { $set: { "messages.$[message].reply.$[reply].message": reply } }, {
                arrayFilters: [{ "message._id": questionId }, { "reply._id": replyId }],
            });
        });
    }
    deleteReply(qnaId, questionId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.updateOne({ _id: qnaId, 'messages._id': questionId }, { $pull: { 'messages.$.reply': { _id: replyId } } });
        });
    }
    deleteQuestion(qnaId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield QNA_1.QNAModel.updateOne({ _id: qnaId }, { $pull: { messages: { _id: questionId } } });
        });
    }
}
const QNARepository = new QNARepositoryClass();
exports.default = QNARepository;
