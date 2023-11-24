"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_progress_1 = __importDefault(require("../../controllers/user-progress"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], user_progress_1.default.createUserProgress)
    .get("/student/details/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], user_progress_1.default.getUserProgress);
exports.default = router;
