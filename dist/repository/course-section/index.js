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
const course_section_1 = __importDefault(require("../../models/course-section"));
class CourseSectionClassRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.findById(id).populate("sectionContent");
        });
    }
    createSection(title, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.create({ title, course: courseId });
        });
    }
    updateSection(id, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.findByIdAndUpdate(id, doc, {
                new: true,
            });
        });
    }
    deleteSection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.findByIdAndDelete(id, {
                new: true,
            });
        });
    }
    saveCourseContentId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.findById(id);
        });
    }
    getCourseSectionByCourseId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_section_1.default.find({
                course: new mongoose_1.default.Types.ObjectId(id),
            })
                .populate("sectionContent")
                .populate("assignment")
                .populate("quiz");
        });
    }
}
const CourseSectionRepository = new CourseSectionClassRepository();
exports.default = CourseSectionRepository;
