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
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: 30,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone Number is required"],
    },
    notificationSetting: {
        type: Boolean,
        required: true,
    },
    enrolledCourses: {
        type: [{ type: mongoose_1.default.Types.ObjectId, ref: "Course" }],
    },
    favouritesCourses: {
        type: [{ type: mongoose_1.default.Types.ObjectId, ref: "Course" }],
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    dp: {
        type: String,
        required: false,
        default: "https://mern-pallab-bucket.s3.eu-west-3.amazonaws.com/user/dp/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT77.jpg",
    },
    bio: {
        type: String,
        required: false,
        default: "",
    },
    heading: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    LinkedIn: {
        type: String,
        required: false,
    },
    youtube: {
        type: String,
        required: false,
    },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
