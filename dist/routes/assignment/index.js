"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_1 = require("../../configs/file");
const assignment_1 = __importDefault(require("../../controllers/assignment"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create/:courseId/:sectionId", file_1.upload.single("file_to_upload"), assignment_1.default.createAssignment)
    .get("/submit/all/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], assignment_1.default.getAllSubmittedAssignmentByCourseId)
    .get("/all", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], assignment_1.default.getAllAssignmentByInstructor)
    .get("/submit/details/:courseId/:assignmentId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], assignment_1.default.getSubmittedAssignmentById)
    .post("/submit/:courseId/:sectionId/:assignmentId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent, file_1.upload.single("file_to_upload")], assignment_1.default.submitAssignment)
    .patch("/assessment/create/:courseId/:sectionId/:assignmentId/:submittedAssignmentId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], assignment_1.default.giveGraderToSubmittedAssignment)
    .get("/all/course/:courseId", assignment_1.default.getAllAssignmentOfACourse)
    .get("/all/course/section/:courseId/:sectionId", assignment_1.default.getAllAssignmentOfASection)
    .get("/details/course/section/assignment/:courseId/:sectionId/:assignmentId", assignment_1.default.getAllAssignmentById)
    .patch("/update/:courseId/:sectionId/:assignmentId", file_1.upload.single("file_to_upload"), assignment_1.default.updateAssignment)
    .delete("/disable/:courseId/:sectionId/:assignmentId", assignment_1.default.disableAssignment)
    .patch("/enable/:courseId/:sectionId/:assignmentId", assignment_1.default.enableAssignment);
exports.default = router;
