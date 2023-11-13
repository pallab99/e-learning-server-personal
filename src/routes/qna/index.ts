import express from "express";
import QNAController from "../../controllers/qna";
import {
  isStudentOrInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .post(
    "/create/question",
    [tokenAuthorization, isStudentOrInstructor, ...validator.addQNA],
    QNAController.addQuestion
  )
  .patch(
    "/update/question/reply/:questionId",
    [tokenAuthorization, isStudentOrInstructor, ...validator.replyToQNA],
    QNAController.replyToQuestion
  )
  .patch(
    "/update/question/:courseId/:questionId",
    [tokenAuthorization, isStudentOrInstructor, ...validator.updateQNA],
    QNAController.updateQuestion
  )
  .patch(
    "/update/question/reply/:courseId/:questionId/:replyId",
    [tokenAuthorization, isStudentOrInstructor, ...validator.updateReply],
    QNAController.updateReply
  )
  .delete(
    "/delete/question/:courseId/:qnaId/:questionId",
    [tokenAuthorization, isStudentOrInstructor],
    QNAController.deleteQuestion
  )
  .delete(
    "/delete/question/reply/:courseId/:qnaId/:questionId/:replyId",
    [tokenAuthorization, isStudentOrInstructor],
    QNAController.deleteReply
  );

export default router;
