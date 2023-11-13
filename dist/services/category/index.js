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
const category_1 = __importDefault(require("../../repository/category"));
class CategoryServiceClass {
    createCategory(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield category_1.default.createCategory(title);
            return { success: result ? 1 : 0, data: result };
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield category_1.default.findByTitle(title);
            return { success: result ? true : false, data: result };
        });
    }
    allCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield category_1.default.getAllCategory();
            return { success: result && result.length ? 1 : 0, data: result };
        });
    }
}
const CategoryService = new CategoryServiceClass();
exports.default = CategoryService;
