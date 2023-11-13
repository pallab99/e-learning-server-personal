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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../models/auth");
class AuthRepositoryClass {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_1.AuthModel.findOne({ email });
        });
    }
    createUser(email, password, rank, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_1.AuthModel.create({
                email,
                password,
                rank,
                user,
            });
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_1.AuthModel.findById(userId);
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return entity.save();
        });
    }
    isEmailVerified(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_1.AuthModel.findById({ _id: userId });
            return user === null || user === void 0 ? void 0 : user.isVerified;
        });
    }
    userDisabled(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByEmail(email);
            return user === null || user === void 0 ? void 0 : user.disabled;
        });
    }
    getAllInstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_1.AuthModel.find({ rank: 2 })
                .populate("user")
                .select("-password -resetPassword -resetPasswordToken -resetPasswordExpired");
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield auth_1.AuthModel.find({ rank: 3 })
                .populate("user")
                .select("-password -resetPassword -resetPasswordToken -resetPasswordExpired");
        });
    }
}
const AuthRepository = new AuthRepositoryClass();
exports.default = AuthRepository;
