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
const course_1 = __importDefault(require("../../models/course"));
const assignment_1 = __importDefault(require("../../services/assignment"));
const course_2 = __importDefault(require("../../services/course"));
const course_section_1 = __importDefault(require("../../services/course-section"));
const submit_assignment_1 = __importDefault(require("../../services/submit-assignment"));
const user_1 = __importDefault(require("../../services/user"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
class AssignmentControllerClass {
    createAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { title, description, instructions, point } = req.body;
                const { courseId, sectionId } = req.params;
                const file = req.file;
                const course = yield course_2.default.findById(courseId);
                const courseSection = yield course_section_1.default.findById(sectionId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!courseSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND);
                }
                if (courseSection.data.assignment) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.SINGLE_ASSIGNMENT);
                }
                const saveFileOnServer = yield assignment_1.default.saveFileOnServer(file, course.data.title, courseSection.data.title);
                if (!saveFileOnServer.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_ERROR);
                }
                const newAssignment = yield assignment_1.default.createAssignment(title, description, saveFileOnServer.data, sectionId, courseId, point, instructions);
                if (!newAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_CREATE_FAILED);
                }
                const saveAssignmentInSection = yield course_section_1.default.saveAssignment(newAssignment.data._id, courseSection.data);
                if (!saveAssignmentInSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_CREATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_CREATE_SUCCESS, newAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, assignmentId } = req.params;
                const file = req.file;
                const course = yield course_2.default.findById(courseId);
                const courseSection = yield course_section_1.default.findById(sectionId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!courseSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND);
                }
                let data = Object.assign({}, req.body);
                if (file) {
                    const saveFileOnServer = yield assignment_1.default.saveFileOnServer(file, course.data.title, courseSection.data.title);
                    data = Object.assign(Object.assign({}, data), { assignmentFileURL: saveFileOnServer.data });
                }
                const updatedAssignment = yield assignment_1.default.updateAssignmentById(assignmentId, data);
                if (!updatedAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_UPDATE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_UPDATE_SUCCESS, updatedAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    disableAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, assignmentId } = req.params;
                const course = yield course_2.default.findById(courseId);
                const courseSection = yield course_section_1.default.findById(sectionId);
                const assignment = yield assignment_1.default.findById(assignmentId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!courseSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND);
                }
                if (!assignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_NOT_FOUND);
                }
                const disableAssignment = yield assignment_1.default.disableAssignment(assignment.data);
                if (!disableAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_DISABLE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_DISABLE_SUCCESS, disableAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    enableAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, assignmentId } = req.params;
                const course = yield course_2.default.findById(courseId);
                const courseSection = yield course_section_1.default.findById(sectionId);
                const assignment = yield assignment_1.default.findById(assignmentId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!courseSection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND);
                }
                if (!assignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_NOT_FOUND);
                }
                const disableAssignment = yield assignment_1.default.enableAssignment(assignment.data);
                if (!disableAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_ENABLE_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_ENABLE_SUCCESS, disableAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllAssignmentOfACourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.params;
                const course = yield course_2.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                const allAssignmentOfACourse = yield assignment_1.default.getAllAssignmentOfACourse(courseId);
                if (!allAssignmentOfACourse.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NOT_FOUND);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, allAssignmentOfACourse.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllAssignmentOfASection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId } = req.params;
                const course = yield course_2.default.findById(courseId);
                const section = yield course_section_1.default.findById(sectionId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!section.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                const allAssignmentOfASection = yield assignment_1.default.getAllAssignmentOfASection(sectionId);
                if (!allAssignmentOfASection.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NOT_FOUND);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, allAssignmentOfASection.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllAssignmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, assignmentId } = req.params;
                const course = yield course_2.default.findById(courseId);
                const section = yield course_section_1.default.findById(sectionId);
                const assignment = yield assignment_1.default.findById(assignmentId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!section.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.COURSE_NOT_FOUND);
                }
                if (!assignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.NOT_FOUND);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, assignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    submitAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { title, description, comments } = req.body;
                const { courseId, sectionId, assignmentId } = req.params;
                const file = req.file;
                const { email } = req.user;
                const student = yield user_1.default.findByEmail(email);
                const course = yield course_2.default.findById(courseId);
                const section = yield course_section_1.default.findById(sectionId);
                const assignment = yield assignment_1.default.findById(assignmentId);
                if (!course.success ||
                    !section.success ||
                    !assignment.success ||
                    !student) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const saveAssignmentOnServer = yield assignment_1.default.saveAssignmentOnServer(file, course.data.title, section.data.title);
                if (!saveAssignmentOnServer.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.S3_SERVER_ERROR);
                }
                const assignmentData = {
                    title: title,
                    description: description,
                    assignmentFileURL: saveAssignmentOnServer.data,
                    student: student._id,
                    course: courseId,
                    courseSection: sectionId,
                    assignment: assignmentId,
                    comments: comments,
                };
                const saveAssignment = yield submit_assignment_1.default.submitAssignment(assignmentData);
                if (!saveAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_SUBMIT_FAILED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_SUBMIT_SUCCESS, saveAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllSubmittedAssignmentByCourseId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId } = req.params;
                const course = yield course_2.default.findById(courseId);
                if (!course.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const allAssignment = yield submit_assignment_1.default.getAllAssignmentByCourseId(courseId);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, allAssignment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getSubmittedAssignmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, assignmentId } = req.params;
                // console.log(courseId, assignmentId);
                const course = yield course_2.default.findById(courseId);
                const assignment = yield submit_assignment_1.default.findById(assignmentId);
                console.log(assignment);
                if (!course.success || !assignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, assignment);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    giveGraderToSubmittedAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { courseId, sectionId, assignmentId, submittedAssignmentId } = req.params;
                const { grade, feedback } = req.body;
                const course = yield course_2.default.findById(courseId);
                const section = yield course_section_1.default.findById(sectionId);
                const assignment = yield assignment_1.default.findById(assignmentId);
                const submittedAssignment = yield submit_assignment_1.default.findById(submittedAssignmentId);
                if (!course.success ||
                    !section.success ||
                    !assignment.success ||
                    !submittedAssignment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const checkMark = yield assignment_1.default.checkMark(grade, assignment.data.point);
                if (!checkMark.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.INVALID_GRADE);
                }
                const addAssessment = yield submit_assignment_1.default.submitAssessment(submittedAssignmentId, grade, feedback);
                if (!addAssessment.success) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_ASSESSMENT_FAIlED);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.ASSIGNMENT_ASSESSMENT_SUCCESS, addAssessment.data);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllAssignmentByInstructor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                // const { courseId } = req.params;
                const { email } = req.user;
                const instructor = yield user_1.default.findByEmail(email);
                if (!instructor) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const findAllCourseByInstructor = yield course_1.default.find({
                    instructors: { $in: [instructor._id] },
                });
                console.log(findAllCourseByInstructor);
                // const course = await CourseService.findById(courseId);
                // if (!course.success) {
                //   return sendResponse(
                //     res,
                //     HTTP_STATUS.NOT_FOUND,
                //     RESPONSE_MESSAGE.COURSE_NOT_FOUND
                //   );
                // }
                // const allAssignmentOfACourse =
                //   await AssignmentService.getAllAssignmentOfACourse(courseId);
                // if (!allAssignmentOfACourse.success) {
                //   return sendResponse(
                //     res,
                //     HTTP_STATUS.BAD_REQUEST,
                //     RESPONSE_MESSAGE.NOT_FOUND
                //   );
                // }
                // return sendResponse(
                //   res,
                //   HTTP_STATUS.OK,
                //   RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
                //   allAssignmentOfACourse.data
                // );
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
const AssignmentController = new AssignmentControllerClass();
exports.default = AssignmentController;
