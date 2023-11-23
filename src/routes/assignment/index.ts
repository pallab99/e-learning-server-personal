import express from "express";
import { upload } from "../../configs/file";
import AssignmentController from "../../controllers/assignment";
import {
  isInstructor,
  isStudent,
  isStudentOrInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";

const router = express.Router();

router
  .post(
    "/create/:courseId/:sectionId",
    upload.single("file_to_upload"),
    AssignmentController.createAssignment
  )
  .get(
    "/submit/all/:courseId",
    [tokenAuthorization, isInstructor],
    AssignmentController.getAllSubmittedAssignmentByCourseId
  )
  .get(
    "/all",
    [tokenAuthorization, isInstructor],
    AssignmentController.getAllAssignmentByInstructor
  )
  .get(
    "/submit/details/:courseId/:assignmentId",
    [tokenAuthorization, isStudentOrInstructor],
    AssignmentController.getSubmittedAssignmentById
  )
  .get(
    "/submit/user/:courseId/:assignmentId",
    [tokenAuthorization, isStudentOrInstructor],
    AssignmentController.getAssignmentSubmittedByUser
  )
  .post(
    "/submit/:courseId/:sectionId/:assignmentId",
    [tokenAuthorization, isStudent, upload.single("file_to_upload")],
    AssignmentController.submitAssignment
  )
  .patch(
    "/assessment/create/:assignmentId/:submittedAssignmentId",
    [tokenAuthorization, isInstructor],
    AssignmentController.giveGraderToSubmittedAssignment
  )
  .get("/all/course/:courseId", AssignmentController.getAllAssignmentOfACourse)
  .get(
    "/all/course/section/:courseId/:sectionId",
    AssignmentController.getAllAssignmentOfASection
  )
  .get(
    "/details/course/section/assignment/:courseId/:sectionId/:assignmentId",
    AssignmentController.getAllAssignmentById
  )
  .patch(
    "/update/:courseId/:sectionId/:assignmentId",
    upload.single("file_to_upload"),
    AssignmentController.updateAssignment
  )
  .delete(
    "/disable/:courseId/:sectionId/:assignmentId",
    AssignmentController.disableAssignment
  )
  .patch(
    "/enable/:courseId/:sectionId/:assignmentId",
    AssignmentController.enableAssignment
  );

export default router;
