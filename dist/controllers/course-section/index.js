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
const express_validator_1 = require("express-validator");
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const course_1 = __importDefault(require("../../services/course"));
const course_section_1 = __importDefault(require("../../services/course-section"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const sendValidationError_1 = require("../../utils/sendValidationError");
const user_1 = __importDefault(require("../../services/user"));
const jwt = require("jsonwebtoken");
class CourseSectionClass {
    getCourseSection(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.params;
                const fetchCourseContent = (courseId) => __awaiter(this, void 0, void 0, function* () {
                    const courseContent = yield course_section_1.default.courseContentForNonSubscribedStudent(courseId);
                    if (!courseContent.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                    }
                    return courseContent;
                });
                if ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
                    const { accessToken } = req.cookies;
                    const token = accessToken;
                    const secretKey = process.env.ACCESS_TOKEN_SECRET;
                    const validate = jwt.verify(token, secretKey);
                    const user = yield user_1.default.findByEmail(validate === null || validate === void 0 ? void 0 : validate.email);
                    if (!user) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                    }
                    const userEnrolledInCourse = yield course_1.default.userEnrolledInCourse(courseId, user._id);
                    if (!userEnrolledInCourse.success) {
                        const courseContentForNonSubscribedStudent = yield fetchCourseContent(courseId);
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, courseContentForNonSubscribedStudent === null || courseContentForNonSubscribedStudent === void 0 ? void 0 : courseContentForNonSubscribedStudent.data);
                    }
                    else {
                        const result = yield course_section_1.default.getCourseSectionByCourseId(courseId);
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, result.data);
                    }
                }
                else {
                    const courseContentForNonSubscribedStudent = yield fetchCourseContent(courseId);
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, courseContentForNonSubscribedStudent === null || courseContentForNonSubscribedStudent === void 0 ? void 0 : courseContentForNonSubscribedStudent.data);
                }
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    createCourseSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { courseId } = req.params;
                const { title } = req.body;
                const course = yield course_1.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const result = yield course_section_1.default.createSection(title, courseId);
                if (!result.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.COURSE_SECTION_CREATED, result.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateCourseSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const { title, isVisible } = req.body;
                const { courseId, courseSectionId } = req.params;
                const course = yield course_1.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const updatedDoc = yield course_section_1.default.updateSection(courseSectionId, {
                    title,
                    isVisible,
                });
                if (!updatedDoc.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.UPDATE_SUCCESS, updatedDoc.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteCourseSection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, courseSectionId } = req.params;
                const course = yield course_1.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const deletedSection = yield course_section_1.default.deleteSection(courseSectionId);
                if (!deletedSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.ACCEPTED, responseMessage_1.RESPONSE_MESSAGE.DELETE_SUCCESS, deletedSection.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const CourseSectionController = new CourseSectionClass();
exports.default = CourseSectionController;
