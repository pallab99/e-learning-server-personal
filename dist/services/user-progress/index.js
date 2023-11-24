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
const user_progress_1 = require("../../repository/user-progress");
class UserProgressServiceClass {
    constructor() {
        this.userProgressRepository = new user_progress_1.UserProgressRepository();
    }
    create(studentId, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userProgressRepository.create(studentId, courseId, contentId);
            return { success: result ? true : false, data: result };
        });
    }
    update(studentId, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userProgressRepository.update(studentId, courseId, contentId);
            return { success: result ? true : false, data: result };
        });
    }
}
const UserProgressService = new UserProgressServiceClass();
exports.default = UserProgressService;
