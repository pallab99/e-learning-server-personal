import express from "express";
import CourseSectionController from "../../controllers/course-section";
import { validator } from "../../middlewares/validator";
import {
  isInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/create/:courseId",
    [tokenAuthorization, isInstructor, ...validator.createCourseSection],
    CourseSectionController.createCourseSection
  )
  .get(
    "/getSectionCourseById/:courseId",
    [tokenAuthorization, isInstructor],
    CourseSectionController.getCourseSection
  )
  .patch(
    "/update/:courseId/:courseSectionId",
    [tokenAuthorization, isInstructor, ...validator.updateCourseSection],
    CourseSectionController.updateCourseSection
  )
  .delete(
    "/delete/:courseId/:courseSectionId",
    CourseSectionController.deleteCourseSection
  )
  .patch(
    "/change-visibility/:courseId/:courseSectionId",
    [tokenAuthorization, isInstructor],
    CourseSectionController.changeVisibility
  );

export default router;
