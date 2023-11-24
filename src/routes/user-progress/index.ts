import express from "express";
import userProgress from "../../controllers/user-progress";
import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isStudent],
    userProgress.createUserProgress
  )
  .get(
    "/student/details/:courseId",
    [tokenAuthorization, isStudent],
    userProgress.getUserProgress
  );
export default router;
