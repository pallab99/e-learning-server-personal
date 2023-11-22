"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_1 = require("../../configs/file");
const course_content_1 = __importDefault(require("../../controllers/course-content"));
const router = express_1.default.Router();
router
    .post("/create/:courseId/:sectionId", 
//   [...validator.createCourseSection],
file_1.upload.single("file_to_upload"), course_content_1.default.createCourseContent)
    .delete("/delete/:courseId/:sectionId/:contentId", course_content_1.default.deleteCourseContent)
    .patch("/update/:contentId", file_1.upload.single("file_to_upload"), course_content_1.default.updateCourseContent);
//   .get(
//     "/getSectionCourseById/:courseId",
//     CourseSectionController.getCourseSection
//   )
exports.default = router;
