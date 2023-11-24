"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router;
//   .post(
//     "/create",
//     [tokenAuthorization, isStudent],
//     userProgress.updateUserProgress
//   )
//   .get(
//     "/all",
//     // [tokenAuthorization, isStudent],
//     SubscriptionController.getAllSubscriptionList
//   )
//   .get("/details/:subscriptionId", SubscriptionController.getSubscriptionById)
//   .post(
//     "/accept-subscription/:subscriptionId/:courseId",
//     SubscriptionController.acceptSubscription
//   )
//   .post(
//     "/reject-subscription/:subscriptionId/:courseId",
//     // [tokenAuthorization, isStudent],
//     SubscriptionController.rejectSubscription
//   );
exports.default = router;
