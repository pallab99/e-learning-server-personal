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
const course_1 = __importDefault(require("../../models/course"));
class CourseRepositoryClass {
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return entity.save();
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.find({ title });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.findById(id);
        });
    }
    userAvailableInCourse(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(courseId),
                students: { $in: [userId] },
            });
        });
    }
    getCourseByInstructor(instructorId, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                instructors: { $in: [instructorId] },
                title: { $regex: searchTerm, $options: "i" },
            };
            return yield course_1.default.find(query).sort({ updatedAt: -1 });
        });
    }
    addToEnrollment(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(courseId) }, { $push: { students: userId } });
        });
    }
    userEnrolledInCourse(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(courseId),
                students: userId,
            });
        });
    }
}
const CourseRepository = new CourseRepositoryClass();
exports.default = CourseRepository;
