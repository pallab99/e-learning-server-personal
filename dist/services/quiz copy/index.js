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
const quiz_1 = __importDefault(require("../../repository/quiz"));
class QuizServiceClass {
    createQuiz(quizData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield quiz_1.default.createQuiz(quizData);
            return { success: result ? true : false, data: result };
        });
    }
    calculateTotalMarks(quizData) {
        return __awaiter(this, void 0, void 0, function* () {
            let total_marks = 0;
            quizData.questions.forEach((element) => {
                total_marks += element.point;
            });
            return total_marks;
        });
    }
    updateQuiz(quizId, quizData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield quiz_1.default.findByIdAndUpdate(quizId, quizData);
            return { success: result ? true : false, data: result };
        });
    }
    findById(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield quiz_1.default.findById(quizId);
            return { success: result ? true : false, data: result };
        });
    }
    deleteQuestion(quizId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield quiz_1.default.deleteQuestion(quizId, questionId);
            return { success: result ? true : false, data: result };
        });
    }
}
const QuizService = new QuizServiceClass();
exports.default = QuizService;
