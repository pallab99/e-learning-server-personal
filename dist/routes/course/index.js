"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_1 = require("../../configs/file");
const course_1 = __importDefault(require("../../controllers/course"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const validator_1 = require("../../middlewares/validator");
const router = express_1.default.Router();
router
    .post("/create", [
    tokenValidator_1.tokenAuthorization,
    tokenValidator_1.isInstructor,
    file_1.upload.array("file_to_upload"),
    ...validator_1.validator.createCourse,
], course_1.default.createCourse)
    .get("/all", course_1.default.getAllCourse)
    .get("/all/instructor", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], course_1.default.getCourseByInstructor)
    .get("/getCourseById/:courseId", course_1.default.getCourseById)
    .patch("/update/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor, file_1.upload.array("file_to_upload")], course_1.default.updateCourse);
exports.default = router;
