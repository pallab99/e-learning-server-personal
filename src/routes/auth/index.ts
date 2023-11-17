import express from "express";
import { AuthController } from "../../controllers/auth";
const router = express.Router();

router
  .post("/sign-up", AuthController.signUp)
  .post("/sign-in", AuthController.signIn)
  .delete("/logout", AuthController.logOut)
  .use(
    "/validate-verify-account/:resetToken/:userId",
    AuthController.validateVerifyAccount
  )
  .use("/verify-account/:resetToken/:userId", AuthController.verifyAccount)
  .post("/refreshToken", AuthController.refreshToken)
  .post("/sendEmailForResetPassword", AuthController.sendEmailForPassWordReset)
  .use(
    "/validate-reset-password/:resetToken/:userId",
    AuthController.validateResetPassword
  )
  .post("/reset-password", AuthController.resetPassword);

export default router;
