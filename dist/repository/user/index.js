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
const user_1 = require("../../models/user");
class UserRepositoryClass {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOne({ email });
        });
    }
    createUser(name, email, phoneNumber, notificationSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.create({
                name,
                email,
                phoneNumber,
                notificationSetting,
            });
        });
    }
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.find({});
        });
    }
    getBalance(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByEmail(email);
            return user === null || user === void 0 ? void 0 : user.balance;
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return entity.save();
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findById(userId);
        });
    }
    getAllInstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.find({});
        });
    }
    updateUser(email, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOneAndUpdate({ email: email }, entity, {
                new: true,
            });
        });
    }
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.find({ rank: 2 });
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.find({});
        });
    }
    addToMyLearning(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userId) }, { $push: { enrolledCourses: courseId } });
        });
    }
    getMyLearning(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findById(userId).populate("enrolledCourses");
        });
    }
}
const UserRepository = new UserRepositoryClass();
exports.default = UserRepository;
