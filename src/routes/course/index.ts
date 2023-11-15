import express from "express";
import { upload } from "../../configs/file";
import CourseController from "../../controllers/course";
import {
  isAdmin,
  isInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isInstructor],
    CourseController.createCourse 
  )
  .post(
    "/publish-request/:courseId",
    [tokenAuthorization, isAdmin],
    CourseController.acceptCourseRequest
  )
  .get("/all", CourseController.getAllCourse)
  .get(
    "/all/instructor",
    [tokenAuthorization, isInstructor],
    CourseController.getCourseByInstructor
  )
  .get("/getCourseById/:courseId", CourseController.getCourseById)
  .patch(
    "/update/:courseId",
    [tokenAuthorization, isInstructor, upload.array("file_to_upload")],
    CourseController.updateCourse
  )
  .patch(
    "/upload/demoVideo/:courseId",
    upload.single("file_to_upload"),
    CourseController.uploadDemoVideo
  );

export default router;
