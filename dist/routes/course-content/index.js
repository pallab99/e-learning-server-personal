"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_content_1 = __importDefault(require("../../controllers/course-content"));
const file_1 = require("../../configs/file");
const router = express_1.default.Router();
router
    .post("/create/:courseId/:sectionId", 
//   [...validator.createCourseSection],
file_1.upload.single("file_to_upload"), course_content_1.default.createCourseContent)
    .delete("/delete/:courseId/:sectionId/:contentId", course_content_1.default.deleteCourseContent);
//   .get(
//     "/getSectionCourseById/:courseId",
//     CourseSectionController.getCourseSection
//   )
//   .patch(
//     "/update/:courseId/:courseSectionId",
//     [...validator.updateCourseSection],
//     CourseSectionController.updateCourseSection
//   )
exports.default = router;
