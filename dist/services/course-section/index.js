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
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
const s3Config_1 = require("../../configs/s3Config");
const user_1 = require("../../constant/user");
const course_content_1 = __importDefault(require("../../repository/course-content"));
const course_section_1 = __importDefault(require("../../repository/course-section"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
class CourseSectionClassService {
    createSection(title, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.createSection(title, courseId);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    updateSection(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.updateSection(id, doc);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    deleteSection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.deleteSection(id);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ id });
            const result = yield course_section_1.default.findById(id);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    getCourseSectionByCourseId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.getCourseSectionByCourseId(id);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    saveCourseContentId(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.saveCourseContentId(id);
            if (!result) {
                return { success: false, data: {} };
            }
            result.sectionContent.push(doc);
            yield result.save();
            return { success: true, data: result };
        });
    }
    findTotalContent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const result = await this.getCourseSectionByCourseId(id);
            // console.log(result);
            // if (!result.success) {
            //   return { success: false, data: {} as any };
            // }
            const findById = yield course_section_1.default.findById(id);
            if (!findById) {
                return { success: false, data: {} };
            }
            findById.totalVideo = findById.sectionContent.length;
            yield findById.save();
            // return { success: true, data: result.data.sectionContent.length as any };
        });
    }
    updateTotalContent(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseSection = yield course_section_1.default.findById(id);
            if (courseSection) {
                courseSection.totalVideo = content.length;
                let sum = content.reduce((accumulator, ele) => accumulator + ele.contentLength, 0);
                courseSection.totalHours = sum;
                yield courseSection.save();
            }
        });
    }
    getDataFromServer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const thumbnailCommand = new client_s3_1.GetObjectCommand(params);
            const dpURI = yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, thumbnailCommand);
            if (dpURI) {
                return { success: true, data: dpURI };
            }
            return { success: false, data: [] };
        });
    }
    deleteCourseContentFromSection(sectionId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.findById(sectionId);
            const content = yield course_content_1.default.findById(contentId);
            if (!result || !content) {
                return { success: false, data: [] };
            }
            const index = result.sectionContent.findIndex((ele) => {
                console.log(ele);
                return String(ele._id) === String(contentId);
            });
            console.log({ index });
            if (index != -1 && result.totalHours && result.totalVideo) {
                result.sectionContent.splice(index, 1);
                result.totalVideo -= 1;
                result.totalHours -= content.contentLength;
                yield result.save();
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
    getCourseContent(result) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("result", result);
            const data = yield Promise.all(
            // Array.from(result, async (ele: any) => {
            //   const sectionContentData = await Promise.all(
            //     Array.from(
            //       ele.sectionContent,
            //       async (content: any, index: number) => {
            //         // const ContentObjectParams = createObjectParamsForS3(
            //         //   content.contentUrl
            //         // );
            //         // const courseContent =
            //         //   await this.getDataFromServer(ContentObjectParams);
            //         const fileURL = publicURL + content.contentUrl;
            //         return {
            //           content,
            //           courseContentURL: fileURL,
            //         };
            //       }
            //     )
            //   );
            //   return [ele, sectionContentData];
            // })
            result.map((ele) => __awaiter(this, void 0, void 0, function* () {
                console.log(ele);
                if (!ele.sectionContent) {
                    return ele;
                }
                else {
                    const contents = yield Promise.all(ele.sectionContent.map((content) => __awaiter(this, void 0, void 0, function* () {
                        let fileURL = user_1.publicURL + content.contentUrl;
                        return {
                            ele,
                            // content: content,
                            fileURL: fileURL,
                        };
                    })));
                    return contents;
                }
            })));
            const newData = result.map((obj) => {
                const newObj = Object.assign({}, obj);
                const x = newObj.toObject();
                console.log(x);
                newObj.sectionContent.forEach((content) => {
                    content.newProperty = "new value";
                });
                return newObj;
            });
            console.log("new data", newData);
            if (data.length) {
                return { success: true, data };
            }
            return { success: false, data: [] };
        });
    }
    saveAssignment(id, sectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            sectionData.assignment = id;
            sectionData.save();
            return { success: Object.keys(sectionData).length, data: sectionData };
        });
    }
    addQuiz(quizId, sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.findById(sectionId);
            if (!result) {
                return { success: false, data: {} };
            }
            console.log(quizId, result);
            result.quiz = quizId;
            yield result.save();
            return { success: true, data: result };
        });
    }
    courseContentForNonSubscribedStudent(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield course_section_1.default.courseContentForNonSubscribedStudent(courseId);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: [] };
        });
    }
}
const CourseSectionService = new CourseSectionClassService();
exports.default = CourseSectionService;
