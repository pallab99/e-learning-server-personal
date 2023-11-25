import express from "express";
import { upload } from "../../configs/file";
import CourseContentController from "../../controllers/course-content";
import {
  isInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/create/:courseId/:sectionId",
    upload.single("file_to_upload"),
    CourseContentController.createCourseContent
  )
  .delete(
    "/delete/:courseId/:sectionId/:contentId",
    CourseContentController.deleteCourseContent
  )
  .patch(
    "/update/:contentId",
    upload.single("file_to_upload"),
    CourseContentController.updateCourseContent
  )
  .patch(
    "/disable/:contentId",
    [tokenAuthorization, isInstructor],
    CourseContentController.disableCourseContent
  );


export default router;
