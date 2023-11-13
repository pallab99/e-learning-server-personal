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
const quiz_submission_1 = __importDefault(require("../../repository/quiz submission"));
class QuizSubmitServiceClass {
    calculateMarks(userAnsArray, correctAnswer) {
        let marks = userAnsArray
            .map((value, index) => (value === correctAnswer[index] ? 1 : 0))
            .reduce((a, b) => a + b, 0);
        return marks;
    }
    submitQuiz(quizSubmitData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield quiz_submission_1.default.submitQuiz(quizSubmitData);
            return { success: result ? true : false, data: result };
        });
    }
}
const QuizSubmitService = new QuizSubmitServiceClass();
exports.default = QuizSubmitService;
