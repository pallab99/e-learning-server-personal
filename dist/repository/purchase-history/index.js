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
const purchase_history_1 = require("../../models/purchase-history");
class PurchaseHistoryRepositoryClass {
    createPurchase(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchase_history_1.PurchaseHistoryModel.create({
                user: userId,
                courses: courseId,
            });
        });
    }
    getAllPurchase() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchase_history_1.PurchaseHistoryModel.find()
                .populate("user")
                .populate("courses");
        });
    }
    findById(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchase_history_1.PurchaseHistoryModel.findById(purchaseId)
                .populate("user")
                .populate("courses");
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchase_history_1.PurchaseHistoryModel.find({
                user: userId,
            })
                .populate("user")
                .populate("courses");
        });
    }
}
const PurchaseHistoryRepository = new PurchaseHistoryRepositoryClass();
exports.default = PurchaseHistoryRepository;
