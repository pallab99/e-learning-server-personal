import express from "express";
import { validator } from "../../middlewares/validator";
import CourseContentController from "../../controllers/course-content";
import { upload } from "../../configs/file";
const router = express.Router();

router
  .post(
    "/create/:courseId/:sectionId",
    //   [...validator.createCourseSection],
    upload.single("file_to_upload"),
    CourseContentController.createCourseContent
  )
  .delete(
    "/delete/:courseId/:sectionId/:contentId",
    CourseContentController.deleteCourseContent
  );
//   .get(
//     "/getSectionCourseById/:courseId",
//     CourseSectionController.getCourseSection
//   )
//   .patch(
//     "/update/:courseId/:courseSectionId",
//     [...validator.updateCourseSection],
//     CourseSectionController.updateCourseSection
//   )

export default router;
