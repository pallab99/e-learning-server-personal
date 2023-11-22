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
const submit_assignment_1 = __importDefault(require("../../repository/submit-assignment"));
class SubmitAssignmentServiceClass {
    submitAssignment(assignmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield submit_assignment_1.default.submitAssignment(assignmentData);
            return { success: result ? 1 : 0, data: result };
        });
    }
    getAllAssignmentByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield submit_assignment_1.default.getAllSubmittedAssignmentByCourseId(courseId);
            return { success: result && result.length ? 1 : 0, data: result };
        });
    }
    findById(assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield submit_assignment_1.default.findById(assignmentId);
            console.log({ result });
            return { success: result ? 1 : 0, data: result };
        });
    }
    submitAssessment(submittedAssignmentId, grade, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield submit_assignment_1.default.submitAssessment(submittedAssignmentId, grade, feedback);
            return { success: result ? 1 : 0, data: result };
        });
    }
}
const SubmitAssignmentService = new SubmitAssignmentServiceClass();
exports.default = SubmitAssignmentService;
