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
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const s3Config_1 = require("../../configs/s3Config");
const filetypes_1 = require("../../constant/filetypes");
const user_1 = require("../../constant/user");
const generateFileName_1 = require("../../helper/generateFileName");
const course_1 = __importDefault(require("../../repository/course"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
class CourseServiceClass {
    saveFilesOnServer(files, body, newCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            const S3_Bucket_path = `course`;
            const uploadPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const fileName = (0, generateFileName_1.generateFileName)(S3_Bucket_path, body.title, file.originalname);
                console.log(fileName);
                const fileExt = file.originalname.split(".")[1];
                if (filetypes_1.videoFileTypes.includes(fileExt)) {
                    newCourse.demoVideo = user_1.publicURL + fileName;
                }
                else if (filetypes_1.imageFileTypes.includes(fileExt)) {
                    newCourse.thumbnail = user_1.publicURL + fileName;
                }
                const params = {
                    Bucket: bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                console.log({ params });
                const command = new client_s3_1.PutObjectCommand(params);
                const upload = yield s3Config_1.s3Client.send(command);
                console.log({ upload });
                // return await s3Client.send(command);
            }));
            yield Promise.all(uploadPromises);
            return newCourse;
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.save(entity);
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_1.default.findByTitle(title);
            if (Object.keys(result).length) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    getFilesFromServer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // const fileCommand = new GetObjectCommand(params);
            // const fileURL = await getSignedUrl(s3Client, fileCommand);
            // console.log(fileURL);
            const fileURL = user_1.publicURL + params;
            if (fileURL.length) {
                console.log("hello", fileURL);
                return { success: true, data: fileURL };
            }
            return { success: false, data: [] };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_1.default.findById(id);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: {} };
        });
    }
    addUserToEnrollmentList(course, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            course.students.push(userId);
            const result = yield course.save();
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: {} };
        });
    }
    userAvailableInCourse(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_1.default.userAvailableInCourse(courseId, userId);
            return { success: result ? true : false, data: result };
        });
    }
    addReviewRatingToCourse(reviewId, course) {
        return __awaiter(this, void 0, void 0, function* () {
            course.reviews.push(reviewId);
            const result = yield course.save();
            return { success: result ? true : false, data: result };
        });
    }
    removeReviewFromCourse(reviewId, course) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = course.reviews.findIndex((ele) => String(ele) === String(reviewId));
            if (index !== -1) {
                course.reviews.splice(index, 1);
                const result = yield course.save();
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    getCourseByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_1.default.getCourseByInstructor(instructorId);
            return {
                success: result && result.length >= 0 ? true : false,
                data: result,
            };
        });
    }
}
const CourseService = new CourseServiceClass();
exports.default = CourseService;
