"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_1 = __importDefault(require("../../controllers/quiz"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], quiz_1.default.createQuiz)
    .patch("/update/:quizId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], quiz_1.default.updateQuiz)
    .delete("/delete/question/:quizId/:questionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], quiz_1.default.deleteQuestionFromQuiz)
    .post("/submit/:quizId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent]);
exports.default = router;
