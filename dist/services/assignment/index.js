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
const user_1 = require("../../constant/user");
const generateFileName_1 = require("../../helper/generateFileName");
const parallelUploader_1 = require("../../helper/parallelUploader");
const s3ParamsGenerator_1 = require("../../helper/s3ParamsGenerator");
const assignment_1 = __importDefault(require("../../repository/assignment"));
const bucketName = process.env.S3_BUCKET_NAME;
class AssignmentServiceClass {
    saveFileOnServer(file, courseTitle, sectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const S3_Bucket_path = `course/${courseTitle}/${sectionName}`;
            const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, sectionName, file.originalname);
            // console.log("filename", fileName);
            const params = (0, s3ParamsGenerator_1.s3ParamsGenerator)(bucketName, fileName, file.buffer, file.mimetype);
            const uploadParallel = (0, parallelUploader_1.parallelUploader)(params);
            uploadParallel.on("httpUploadProgress", (progress) => {
                //   console.log("prog", progress);
            });
            const uploadedData = yield uploadParallel.done();
            console.log(uploadedData);
            if (uploadedData.$metadata.httpStatusCode === 200) {
                return { success: true, data: (user_1.publicURL + fileName) };
            }
            return { success: false, data: [] };
        });
    }
    createAssignment(title, description, assignmentFileURL, courseSection, course, point, instructions) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield assignment_1.default.createAssignment(title, description, assignmentFileURL, courseSection, course, point, instructions);
            return { success: Object.keys(result).length, data: result };
        });
    }
    updateAssignmentById(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield assignment_1.default.updateAssignment(id, doc);
            return { success: result ? Object.keys(result).length : 0, data: result };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield assignment_1.default.findById(id);
            return {
                success: result ? Object.keys(result).length : 0,
                data: result,
            };
        });
    }
    disableAssignment(assignment) {
        return __awaiter(this, void 0, void 0, function* () {
            assignment.disabled = true;
            const result = yield assignment.save();
            return { success: result ? Object.keys(result).length : 0, data: result };
        });
    }
    enableAssignment(assignment) {
        return __awaiter(this, void 0, void 0, function* () {
            assignment.disabled = false;
            const result = yield assignment.save();
            return { success: result ? Object.keys(result).length : 0, data: result };
        });
    }
    getAllAssignmentOfACourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield assignment_1.default.getAssignmentByCourseId(id);
            return { success: result ? result.length : 0, data: result };
        });
    }
    getAllAssignmentOfASection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield assignment_1.default.getAssignmentBySectionId(id);
            return { success: result ? Object.keys(result).length : 0, data: result };
        });
    }
    saveAssignmentOnServer(file, courseTitle, sectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const S3_Bucket_path = `course/${courseTitle}/submitted-assignment/${sectionName}`;
            const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, sectionName, file.originalname);
            // console.log("filename", fileName);
            const params = (0, s3ParamsGenerator_1.s3ParamsGenerator)(bucketName, fileName, file.buffer, file.mimetype);
            const uploadParallel = (0, parallelUploader_1.parallelUploader)(params);
            uploadParallel.on("httpUploadProgress", (progress) => {
                //   console.log("prog", progress);
            });
            const uploadedData = yield uploadParallel.done();
            console.log(uploadedData);
            if (uploadedData.$metadata.httpStatusCode === 200) {
                return { success: true, data: (user_1.publicURL + fileName) };
            }
            return { success: false, data: [] };
        });
    }
    checkMark(mark, assignmentMark) {
        return __awaiter(this, void 0, void 0, function* () {
            return { success: mark <= assignmentMark, data: mark };
        });
    }
}
const AssignmentService = new AssignmentServiceClass();
exports.default = AssignmentService;
