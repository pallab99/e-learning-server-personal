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
const subscription_1 = require("../../models/subscription");
class SubscriptionRepositoryClass {
    applySubscription(userId, courses) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.SubscriptionModel.create({ user: userId, courses: courses });
        });
    }
    getAllSubscriptionListPopulated() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.SubscriptionModel.find({})
                .populate("user")
                .populate("courses");
        });
    }
    findByIdPopulated(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.SubscriptionModel.findById(subscriptionId)
                .populate("user")
                .populate("courses");
        });
    }
    findByIdAndDelete(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscription_1.SubscriptionModel.findByIdAndDelete(subscriptionId, {
                new: true,
            });
        });
    }
}
const SubscriptionRepository = new SubscriptionRepositoryClass();
exports.default = SubscriptionRepository;
