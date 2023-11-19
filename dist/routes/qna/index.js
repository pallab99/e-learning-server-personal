"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qna_1 = __importDefault(require("../../controllers/qna"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const validator_1 = require("../../middlewares/validator");
const router = express_1.default.Router();
router
    .get("/all/details/:courseId", 
// [tokenAuthorization, isStudentOrInstructor], 
qna_1.default.getAllQNQOfACourse)
    .post("/create/question", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor, ...validator_1.validator.addQNA], qna_1.default.addQuestion)
    .patch("/update/question/reply/:questionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor, ...validator_1.validator.replyToQNA], qna_1.default.replyToQuestion)
    .patch("/update/question/:courseId/:questionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor, ...validator_1.validator.updateQNA], qna_1.default.updateQuestion)
    .patch("/update/question/reply/:courseId/:questionId/:replyId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor, ...validator_1.validator.updateReply], qna_1.default.updateReply)
    .delete("/delete/question/:courseId/:qnaId/:questionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor], qna_1.default.deleteQuestion)
    .delete("/delete/question/reply/:courseId/:qnaId/:questionId/:replyId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudentOrInstructor], qna_1.default.deleteReply);
exports.default = router;
