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
const mongoose_1 = __importDefault(require("mongoose"));
const responseMessage_1 = require("../../constant/responseMessage");
const statusCode_1 = require("../../constant/statusCode");
const user_1 = require("../../constant/user");
const allcoursePipelinebuilder_1 = require("../../helper/allcoursePipelinebuilder");
const generateFileName_1 = require("../../helper/generateFileName");
const course_1 = __importDefault(require("../../models/course"));
const course_2 = __importDefault(require("../../services/course"));
const user_2 = __importDefault(require("../../services/user"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const sendValidationError_1 = require("../../utils/sendValidationError");
const bucketName = process.env.S3_BUCKET_NAME;
class CourseControllerClass {
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const validation = (0, express_validator_1.validationResult)(req).array();
                if (validation.length) {
                    return (0, sendValidationError_1.sendValidationError)(res, validation);
                }
                const body = req.body;
                const { email } = req.user;
                const findByTitle = yield course_2.default.findByTitle(body.title);
                if (findByTitle.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.CONFLICT, responseMessage_1.RESPONSE_MESSAGE.COURSE_TITLE);
                }
                const instructor = yield user_2.default.findByEmail(email);
                if (!instructor) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                let instructorId = [];
                instructorId.push(instructor._id);
                const newCourse = yield course_1.default.create(body);
                newCourse.instructors.push(instructor._id);
                yield newCourse.save();
                console.log(newCourse);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.CREATED, responseMessage_1.RESPONSE_MESSAGE.COURSE_CREATED, newCourse);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.params;
                const course = yield course_1.default.findOne({ _id: courseId }).populate("instructors");
                if (!course) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, course);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { page, limit, search, instructors, category, filterCategory, filterLevel, filterTotalHours, type, value, } = req.query;
                const query = {};
                // Pagination
                if (type || value) {
                    console.log({ type, value });
                    if (type === "disable") {
                        const result = yield course_1.default.find({ disable: true });
                        if (!result) {
                            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                        }
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, {
                            courses: result,
                        });
                    }
                    if (type === "verified" && value === "true") {
                        const result = yield course_1.default.find({ verified: true });
                        if (!result) {
                            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                        }
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, {
                            courses: result,
                        });
                    }
                    if (type === "verified" && value === "false") {
                        console.log("hello");
                        const result = yield course_1.default.find({ verified: "false" });
                        if (!result) {
                            return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                        }
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, {
                            courses: result,
                        });
                    }
                }
                const pageNumber = parseInt(page) || 1;
                const pageSize = parseInt(limit) || 10;
                const skip = (pageNumber - 1) * pageSize;
                const matchStage = (0, allcoursePipelinebuilder_1.buildMatchStage)(search, instructors, category, filterCategory, filterLevel, filterTotalHours);
                const aggregation = [
                    { $match: matchStage },
                    { $skip: skip },
                    { $limit: pageSize },
                ];
                const courses = yield course_1.default.aggregate(aggregation);
                const totalCourses = yield course_1.default.countDocuments(matchStage);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, {
                    courses,
                    totalCourses,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCourses / pageSize),
                });
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const body = req.body;
                const files = req.files;
                const { courseId } = req.params;
                // const findByTitle = await CourseService.findByTitle(body.title);
                // if (findByTitle.success) {
                //   return sendResponse(
                //     res,
                //     HTTP_STATUS.CONFLICT,
                //     RESPONSE_MESSAGE.COURSE_TITLE
                //   );
                // }
                const newCourse = yield course_1.default.findOneAndUpdate({ _id: courseId }, body, {
                    new: true,
                });
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.CREATED, responseMessage_1.RESPONSE_MESSAGE.COURSE_CREATED, newCourse);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getCourseByInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email } = req.user;
                const instructor = yield user_2.default.findByEmail(email);
                if (!instructor) {
                    return yield (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const courseByInstructor = yield course_2.default.getCourseByInstructor(instructor === null || instructor === void 0 ? void 0 : instructor._id);
                if (!courseByInstructor.success) {
                    return yield (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.NO_DATA, []);
                }
                return yield (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, courseByInstructor.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    acceptCourseRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const { type } = req.query;
                if (type === "reject") {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.REJECT_COURSE_REQUEST);
                }
                const result = yield course_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(courseId) }, { $set: { verified: true } });
                if (!result) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ACCEPT_COURSE_REQUEST);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    uploadDemoVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield course_2.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const file = req.file;
                if (!req.file) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPLOAD_FAILED);
                }
                const S3_Bucket_path = `user/dp`;
                const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, course.data.title, file.originalname);
                console.log(fileName, user_1.publicURL);
                const saveFileOnServer = yield user_2.default.saveDpOnServer(file, fileName, course.data.title);
                if (saveFileOnServer.success) {
                    const uploadDemoVideo = yield course_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(courseId) }, { demoVideo: user_1.publicURL + fileName });
                    if (uploadDemoVideo) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_SUCCESS);
                    }
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPLOAD_FAILED);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    uploadThumbnail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield course_2.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const file = req.file;
                if (!req.file) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPLOAD_FAILED);
                }
                const S3_Bucket_path = `user/dp`;
                const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, course.data.title, file.originalname);
                console.log(fileName, user_1.publicURL);
                const saveFileOnServer = yield user_2.default.saveDpOnServer(file, fileName, course.data.title);
                if (saveFileOnServer.success) {
                    const uploadDemoVideo = yield course_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(courseId) }, { thumbnail: user_1.publicURL + fileName });
                    if (uploadDemoVideo) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_SUCCESS);
                    }
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.UPLOAD_FAILED);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const CourseController = new CourseControllerClass();
exports.default = CourseController;
