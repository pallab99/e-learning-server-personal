"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const courseContent_1 = __importDefault(require("../../models/course-content/courseContent"));
const course_1 = __importDefault(require("../../services/course"));
const course_content_1 = __importDefault(require("../../services/course-content"));
const course_section_1 = __importDefault(require("../../services/course-section"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
class CourseContentClass {
    createCourseContent(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId } = req.params;
                const { title } = req.body;
                const courseDoc = yield course_1.default.findById(courseId);
                const courseSectionDoc = yield course_section_1.default.findById(sectionId);
                if (!courseDoc.success ||
                    !courseSectionDoc.success ||
                    !Object.keys(courseDoc.data).length) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const courseTitle = (_a = courseDoc.data) === null || _a === void 0 ? void 0 : _a.title;
                const sectionTitle = (_b = courseSectionDoc.data) === null || _b === void 0 ? void 0 : _b.title;
                const file = req.file;
                console.log(file);
                const result = yield course_content_1.default.saveFileOnServer(file, courseTitle, sectionTitle);
                if (!result.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_ERROR);
                }
                const contentDuration = yield course_content_1.default.getVideoDuration(file);
                const doc = yield courseContent_1.default.create({
                    contentTitle: title,
                    contentUrl: result.data,
                    contentLength: contentDuration,
                    course: courseId,
                    courseSection: sectionId,
                });
                const allContent = yield course_content_1.default.getAllCourseContentBySectionId(sectionId);
                if (!allContent.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                const updateTotalContent = yield course_section_1.default.updateTotalContent(sectionId, allContent.data);
                const saveContentId = yield course_section_1.default.saveCourseContentId(sectionId, doc._id);
                if (!saveContentId.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_SUCCESS, doc);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteCourseContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, contentId } = req.params;
                const courseDoc = yield course_1.default.findById(courseId);
                const courseSectionDoc = yield course_section_1.default.findById(sectionId);
                const courseContentDoc = yield course_content_1.default.findById(contentId);
                if (!courseDoc.success ||
                    !courseSectionDoc.success ||
                    !courseContentDoc.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const deleteContentFromSection = yield course_section_1.default.deleteCourseContentFromSection(sectionId, contentId);
                if (!(deleteContentFromSection === null || deleteContentFromSection === void 0 ? void 0 : deleteContentFromSection.success)) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.DELETE_FAILED);
                }
                const deleteDoc = yield course_content_1.default.findByIdAndDelete(contentId);
                if (!deleteDoc.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.DELETE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.DELETE_SUCCESS);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const CourseContentController = new CourseContentClass();
exports.default = CourseContentController;
