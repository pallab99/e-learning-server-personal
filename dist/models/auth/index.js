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
exports.AuthModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const authSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [8, "Password must be minimum 8 characters"],
        max: [15, "Password can not be greater than 15 characters"],
    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false,
    },
    rank: {
        type: Number,
        default: 3,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resetPassword: {
        type: Boolean || null,
        required: false,
        default: false,
    },
    resetPasswordToken: {
        type: String || null,
        required: false,
        default: null,
    },
    resetPasswordExpired: {
        type: Date || null,
        required: false,
        default: null,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
}, { timestamps: true });
const AuthModel = mongoose_1.default.model("Auth", authSchema);
exports.AuthModel = AuthModel;
