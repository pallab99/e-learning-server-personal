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
const user_progress_1 = __importDefault(require("../../models/user-progress"));
const user_1 = __importDefault(require("../../services/user"));
const user_progress_2 = __importDefault(require("../../services/user-progress"));
const dbLogger_1 = require("../../utils/dbLogger");
const response_1 = require("../../utils/response");
const mongoose_1 = __importDefault(require("mongoose"));
class UserProgressController {
    createUserProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email } = req.user;
                const { courseId, contentId } = req.body;
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const userProgressAvailable = yield user_progress_1.default.findOne({
                    student: user === null || user === void 0 ? void 0 : user._id,
                    course: courseId,
                });
                if (!userProgressAvailable) {
                    const newUserProgress = yield user_progress_2.default.create(user === null || user === void 0 ? void 0 : user._id, courseId, contentId);
                    if (!newUserProgress.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                    }
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.USER_PROGRESS_UPDATED, newUserProgress.data);
                }
                else {
                    const updateUserProgress = yield user_progress_2.default.update(user === null || user === void 0 ? void 0 : user._id, courseId, contentId);
                    if (!updateUserProgress.success) {
                        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_REQUEST, responseMessage_1.RESPONSE_MESSAGE.SOMETHING_WENT_WRONG);
                    }
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.USER_PROGRESS_UPDATED, updateUserProgress.data);
                }
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getUserProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, dbLogger_1.databaseLogger)(req.originalUrl);
                const { email } = req.user;
                const { courseId } = req.params;
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                const userProgressPipeline = [
                    {
                        $match: {
                            student: new mongoose_1.default.Types.ObjectId(user._id),
                            course: new mongoose_1.default.Types.ObjectId(courseId),
                        },
                    },
                    {
                        $lookup: {
                            from: "coursesections",
                            let: { courseId: new mongoose_1.default.Types.ObjectId(courseId) },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$course", "$$courseId"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        totalItems: {
                                            $add: [
                                                { $size: "$sectionContent" },
                                                { $cond: [{ $ifNull: ["$assignment", false] }, 1, 0] },
                                                { $cond: [{ $ifNull: ["$quiz", false] }, 1, 0] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "courseSections",
                        },
                    },
                    {
                        $unwind: "$courseSections",
                    },
                    {
                        $group: {
                            _id: "$_id",
                            totalContents: { $sum: "$courseSections.totalItems" },
                            completedContents: { $first: { $size: "$completedLessons" } },
                            userProgressObject: { $first: "$$ROOT" },
                        },
                    },
                    {
                        $project: {
                            userProgressObject: 1,
                            progressPercentage: {
                                $cond: [
                                    { $eq: ["$totalContents", 0] },
                                    0,
                                    {
                                        $multiply: [
                                            { $divide: ["$completedContents", "$totalContents"] },
                                            100,
                                        ],
                                    },
                                ],
                            },
                            totalContents: "$totalContents",
                        },
                    },
                    {
                        $addFields: {
                            "userProgressObject.progressPercentage": "$progressPercentage",
                            "userProgressObject.totalContents": "$totalContents",
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$userProgressObject",
                        },
                    },
                ];
                const userProgressResult = yield user_progress_1.default.aggregate(userProgressPipeline);
                if (!userProgressResult || userProgressResult.length === 0) {
                    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.NOT_FOUND, responseMessage_1.RESPONSE_MESSAGE.NO_DATA);
                }
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA, userProgressResult[0]);
            }
            catch (error) {
                console.log(error);
                (0, dbLogger_1.databaseLogger)(error.message);
                return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = new UserProgressController();
