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
const mongoose_1 = __importDefault(require("mongoose"));
const submit_assignment_1 = __importDefault(require("../../models/submit-assignment"));
class SubmitAssignmentRepositoryClass {
    submitAssignment(assignmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(assignmentData);
            return yield submit_assignment_1.default.create({
                title: assignmentData.title,
                description: assignmentData.description,
                comments: assignmentData.comments,
                course: assignmentData.course,
                courseSection: assignmentData.courseSection,
                student: assignmentData.student,
                assignment: assignmentData.assignment,
                assignmentFileURL: assignmentData.assignmentFileURL,
            });
        });
    }
    getAllSubmittedAssignmentByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield submit_assignment_1.default.find({
                course: new mongoose_1.default.Types.ObjectId(courseId),
            })
                .populate("assignment")
                .populate("student")
                .populate("courseSection");
        });
    }
    findById(assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield submit_assignment_1.default.findById(assignmentId)
                .populate("assignment")
                .populate("student")
                .populate("courseSection");
        });
    }
    submitAssessment(submittedAssignmentId, grade, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield submit_assignment_1.default.findByIdAndUpdate(submittedAssignmentId, { grade: grade, feedback: feedback }, { new: true });
        });
    }
}
const SubmitAssignmentRepository = new SubmitAssignmentRepositoryClass();
exports.default = SubmitAssignmentRepository;
