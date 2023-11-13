"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../controllers/auth");
const router = express_1.default.Router();
router
    .post("/sign-up", auth_1.AuthController.signUp)
    .post("/sign-in", auth_1.AuthController.signIn)
    .use("/validate-verify-account/:resetToken/:userId", auth_1.AuthController.validateVerifyAccount)
    .use("/verify-account/:resetToken/:userId", auth_1.AuthController.verifyAccount)
    .post("/refreshToken", auth_1.AuthController.refreshToken)
    .post("/sendEmailForResetPassword", auth_1.AuthController.sendEmailForPassWordReset)
    .use("/validate-reset-password/:resetToken/:userId", auth_1.AuthController.validateResetPassword);
// .post("/verify-account",Auth)
exports.default = router;
