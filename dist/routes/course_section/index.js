"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_section_1 = __importDefault(require("../../controllers/course-section"));
const validator_1 = require("../../middlewares/validator");
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor, ...validator_1.validator.createCourseSection], course_section_1.default.createCourseSection)
    .get("/getSectionCourseById/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], course_section_1.default.getCourseSection)
    .patch("/update/:courseId/:courseSectionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor, ...validator_1.validator.updateCourseSection], course_section_1.default.updateCourseSection)
    .delete("/delete/:courseId/:courseSectionId", course_section_1.default.deleteCourseSection)
    .patch("/change-visibility/:courseId/:courseSectionId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isInstructor], course_section_1.default.changeVisibility);
exports.default = router;
