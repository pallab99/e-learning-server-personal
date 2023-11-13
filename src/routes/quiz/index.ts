import express from "express";
import QuizController from "../../controllers/quiz";
import {
  isInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isInstructor, ...validator.addQuiz],
    QuizController.createQuiz
  )
  .patch(
    "/update/:quizId",
    [tokenAuthorization, isInstructor, ...validator.updateQuiz],
    QuizController.updateQuiz
  )
  .delete(
    "/delete/question/:quizId/:questionId",
    [tokenAuthorization, isInstructor],
    QuizController.deleteQuestionFromQuiz
  );

export default router;
