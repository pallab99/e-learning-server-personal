import express from "express";
import QuizSubmissionController from "../../controllers/quiz-submit";
import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/submit/:quizId",
    [tokenAuthorization, isStudent],
    QuizSubmissionController.submitQuiz
  )
  .get(
    "/submitted-quiz/details/:quizId",
    [tokenAuthorization, isStudent],
    QuizSubmissionController.getSubmittedQuiz
  );

export default router;
