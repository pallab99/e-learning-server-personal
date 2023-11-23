"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_submit_1 = __importDefault(require("../../controllers/quiz-submit"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/submit/:quizId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], quiz_submit_1.default.submitQuiz)
    .get("/submitted-quiz/details/:quizId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], quiz_submit_1.default.getSubmittedQuiz);
exports.default = router;
