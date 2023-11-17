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
const createObjectParams_1 = require("../../helper/createObjectParams");
const parallelUploader_1 = require("../../helper/parallelUploader");
const user_2 = __importDefault(require("../../repository/user"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
class USerServiceClass {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_2.default.findByEmail(email);
        });
    }
    createUserInUser(name, email, phoneNumber, notificationSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_2.default.createUser(name, email, phoneNumber, notificationSetting);
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_2.default.getAllUser();
        });
    }
    getBalance(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.getBalance(email);
            if (result != undefined && result >= 0) {
                return { success: true, data: result };
            }
            return { success: false, data: null };
        });
    }
    addBalance(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_2.default.save(entity);
        });
    }
    saveDpOnServer(file, fileName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: `${bucketName}`,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const uploadParallel = (0, parallelUploader_1.parallelUploader)(params);
            uploadParallel.on("httpUploadProgress", (progress) => {
                console.log("prog", progress);
            });
            const uploadedData = yield uploadParallel.done();
            if (uploadedData.$metadata.httpStatusCode === 200) {
                return { success: true, data: (user_1.publicURL + fileName) };
            }
            return { success: false, data: [] };
            // console.log(result.$metadata.httpStatusCode === 200);
        });
    }
    updateProfilePicture(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_2.default.save(entity);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield user_2.default.findById(userId);
            if (res) {
                return { success: true, data: res };
            }
            return { success: false, data: null };
        });
    }
    getAllInstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.getAllInstructor();
            console.log({ result });
            if (result.length <= 0) {
                return { success: false, data: null };
            }
            const instructors = result.filter((ele) => {
                return ele.rank === 2;
            });
            return { success: true, data: instructors };
        });
    }
    updateUser(email, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.updateUser(email, entity);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: null };
        });
    }
    getDPFromServer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const thumbnailCommand = new client_s3_1.GetObjectCommand(params);
            const dpURI = yield (0, s3_request_presigner_1.getSignedUrl)(s3Config_1.s3Client, thumbnailCommand);
            if (dpURI) {
                return { success: true, data: dpURI };
            }
            return { success: false, data: [] };
        });
    }
    getDpOfAllUser(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Promise.all(result.map((user) => __awaiter(this, void 0, void 0, function* () {
                const DpObjectParams = (0, createObjectParams_1.createObjectParamsForS3)(user.dp);
                const profilePicture = yield this.getDPFromServer(DpObjectParams);
                return {
                    user,
                    profilePictureURL: profilePicture.data,
                };
            })));
            if (data.length) {
                return { success: true, data };
            }
            return { success: false, data: [] };
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.getAllUser();
            if (result.length <= 0) {
                return { success: false, data: null };
            }
            const students = result.filter((ele) => {
                return ele.rank === 3;
            });
            return { success: true, data: students };
        });
    }
    addToMyLearning(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.addToMyLearning(courseId, userId);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: null };
        });
    }
    getMyLearning(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_2.default.getMyLearning(userId);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, data: null };
        });
    }
}
const UserService = new USerServiceClass();
exports.default = UserService;
