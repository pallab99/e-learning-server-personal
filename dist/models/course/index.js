"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    sub_title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructors: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
        required: true,
    },
    students: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: false,
        default: "https://img-c.udemycdn.com/course/750x422/625204_436a_3.jpg",
    },
    level: {
        type: String,
        required: true,
    },
    demoVideo: {
        type: String,
        required: false,
    },
    benefits: {
        type: [String],
        required: true,
    },
    prerequisites: {
        type: [String],
        required: true,
    },
    courseOffering: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CourseOffering",
        required: false,
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Review",
            required: false,
        },
    ],
    numberOfContent: {
        type: Number,
        required: false,
    },
    totalHours: {
        type: Number,
        required: false,
        default: 0,
    },
    course_section: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "CourseSection",
                required: false,
            },
        ],
    },
    QNA: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QNA",
        required: false,
    },
    disable: {
        type: Boolean,
        required: false,
        default: false,
    },
    verified: {
        type: Boolean,
        required: false,
        default: false,
    },
    status: {
        type: Boolean,
        required: false,
        default: false,
    },
}, { timestamps: true });
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
