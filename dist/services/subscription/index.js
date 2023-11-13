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
const subscription_1 = __importDefault(require("../../repository/subscription"));
class SubscriptionServiceClass {
    applySubscription(userId, courses) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield subscription_1.default.applySubscription(userId, courses);
            return { success: result ? Object.keys(result).length : 0, data: result };
        });
    }
    getAllSubscriptionListPopulated() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield subscription_1.default.getAllSubscriptionListPopulated();
            return { success: result ? result.length : 0, data: result };
        });
    }
    findByIdPopulated(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield subscription_1.default.findByIdPopulated(subscriptionId);
            return { success: result ? 1 : 0, data: result };
        });
    }
    removeCourseFromSubscriptionList(subscription, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(subscription);
            const index = subscription.courses.findIndex((ele) => {
                return String(ele._id) === String(courseId);
            });
            if (index != -1) {
                subscription.courses.splice(index, 1);
                yield subscription.save();
                if (subscription.courses.length <= 0) {
                    yield subscription_1.default.findByIdAndDelete(subscription._id);
                }
                return { success: true, data: subscription };
            }
            return { success: false, data: [] };
        });
    }
    removeSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield subscription_1.default.getAllSubscriptionListPopulated();
            return { success: result ? 1 : 0, data: result };
        });
    }
}
const SubscriptionService = new SubscriptionServiceClass();
exports.default = SubscriptionService;
