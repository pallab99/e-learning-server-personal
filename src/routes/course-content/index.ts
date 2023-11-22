import express from "express";
import { upload } from "../../configs/file";
import CourseContentController from "../../controllers/course-content";
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
  )
  .patch(
    "/update/:contentId",
    upload.single("file_to_upload"),
    CourseContentController.updateCourseContent
  );
//   .get(
//     "/getSectionCourseById/:courseId",
//     CourseSectionController.getCourseSection
//   )

export default router;
