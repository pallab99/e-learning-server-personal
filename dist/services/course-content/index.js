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
const dotenv_1 = __importDefault(require("dotenv"));
const get_video_duration_1 = __importDefault(require("get-video-duration"));
const stream_1 = require("stream");
const user_1 = require("../../constant/user");
const generateFileName_1 = require("../../helper/generateFileName");
const parallelUploader_1 = require("../../helper/parallelUploader");
const s3ParamsGenerator_1 = require("../../helper/s3ParamsGenerator");
const course_content_1 = __importDefault(require("../../repository/course-content"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
const { Upload } = require("@aws-sdk/lib-storage");
class CourseContentServiceClass {
    saveFileOnServer(file, courseTitle, sectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const S3_Bucket_path = `course/${courseTitle}`;
            const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, sectionName, file.originalname);
            const params = (0, s3ParamsGenerator_1.s3ParamsGenerator)(bucketName, fileName, file.buffer, file.mimetype);
            const uploadParallel = (0, parallelUploader_1.parallelUploader)(params);
            uploadParallel.on("httpUploadProgress", (progress) => {
                console.log("prog", progress);
            });
            const uploadedData = yield uploadParallel.done();
            if (uploadedData.$metadata.httpStatusCode === 200) {
                return { success: true, data: (user_1.publicURL + fileName) };
            }
            return { success: false, data: [] };
        });
    }
    getVideoDuration(file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("file", file);
            if (file.mimetype === "video/mp4" ||
                file.mimetype === "video/mkv" ||
                file.mimetype === "video/wmv") {
                const videoStream = new stream_1.Readable();
                videoStream.push(file.buffer);
                videoStream.push(null);
                const duration = yield (0, get_video_duration_1.default)(videoStream);
                return duration;
            }
            return 0;
        });
    }
    getAllCourseContentBySectionId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_content_1.default.getCourseContentBySectionId(id);
            if (!result.length) {
                return { success: false, data: {} };
            }
            return { success: true, data: result };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_content_1.default.findById(id);
            if (!result) {
                return { success: false, data: {} };
            }
            return { success: true, data: result };
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_content_1.default.findByIdAndDelete(id);
            console.log("course content service class", result);
            if (!result) {
                return { success: false, data: {} };
            }
            return { success: true, data: result };
        });
    }
}
const CourseContentService = new CourseContentServiceClass();
exports.default = CourseContentService;
