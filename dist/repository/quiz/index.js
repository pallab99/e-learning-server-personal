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
const quiz_1 = require("../../models/quiz");
class QuizRepositoryClass {
    createQuiz(quizData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quiz_1.QuizModel.create(quizData);
        });
    }
    findByIdAndUpdate(quizId, quizData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quiz_1.QuizModel.findByIdAndUpdate(quizId, quizData, { new: true });
        });
    }
    findById(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quiz_1.QuizModel.findByIdAndUpdate(quizId);
        });
    }
    deleteQuestion(quizId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quiz_1.QuizModel.updateOne({ _id: new mongoose_1.default.Types.ObjectId(quizId) }, { $pull: { questions: { _id: new mongoose_1.default.Types.ObjectId(questionId) } } });
        });
    }
}
const QuizRepository = new QuizRepositoryClass();
exports.default = QuizRepository;
