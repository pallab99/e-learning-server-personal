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
const purchase_history_1 = __importDefault(require("../../repository/purchase-history"));
class PurchaseHistoryServiceClass {
    createPurchase(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield purchase_history_1.default.createPurchase(userId, courseId);
            return { success: result ? 1 : 0, data: result };
        });
    }
    getAllPurchase() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield purchase_history_1.default.getAllPurchase();
            return { success: result && result.length ? 1 : 0, data: result };
        });
    }
    findById(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield purchase_history_1.default.findById(purchaseId);
            return { success: result ? 1 : 0, data: result };
        });
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield purchase_history_1.default.findByUserId(userId);
            return { success: result && result.length ? 1 : 0, data: result };
        });
    }
}
const PurchaseHistoryService = new PurchaseHistoryServiceClass();
exports.default = PurchaseHistoryService;
