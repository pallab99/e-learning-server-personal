import express from "express";
import { upload } from "../../configs/file";
import { UserController } from "../../controllers/user";
import {
  isAdmin,
  isStudent,
  isStudentOrInstructor,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import { validator } from "../../middlewares/validator";
const router = express.Router();

router
  .get("/all", [tokenAuthorization, isAdmin], UserController.getAllUser)
  .get("/me", [tokenAuthorization], UserController.getUserProfile)
  .get(
    "/students/all",
    [tokenAuthorization, isAdmin],
    UserController.getAllStudents
  )
  .get(
    "/students/my-learning",
    [tokenAuthorization, isStudent],
    UserController.getMyLearning
  )
  .patch(
    "/update-DP",
    [tokenAuthorization, upload.single("file_to_upload")],
    UserController.updateDp
  )
  .delete(
    "/delete/:userId",
    [tokenAuthorization, isAdmin],
    UserController.deleteUser
  )
  .get(
    "/instructor/all",
    [tokenAuthorization, isAdmin],
    UserController.getAllInstructor
  )
  .patch(
    "/update",
    [tokenAuthorization, isStudentOrInstructor, ...validator.updateUser],
    UserController.updateUser
  );

export default router;
