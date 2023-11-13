import express from "express";
import CourseSectionController from "../../controllers/course-section";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .post(
    "/create/:courseId",
    [...validator.createCourseSection],
    CourseSectionController.createCourseSection
  )
  .get(
    "/getSectionCourseById/:courseId",
    CourseSectionController.getCourseSection
  )
  .patch(
    "/update/:courseId/:courseSectionId",
    [...validator.updateCourseSection],
    CourseSectionController.updateCourseSection
  )
  .delete(
    "/delete/:courseId/:courseSectionId",

    CourseSectionController.deleteCourseSection
  );

export default router;
