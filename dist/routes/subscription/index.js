"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = __importDefault(require("../../controllers/subscription"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], subscription_1.default.applySubscription)
    .get("/all", 
// [tokenAuthorization, isStudent],
subscription_1.default.getAllSubscriptionList)
    .get("/details/:subscriptionId", subscription_1.default.getSubscriptionById)
    .post("/accept-subscription/:subscriptionId/:courseId", subscription_1.default.acceptSubscription)
    .post("/reject-subscription/:subscriptionId/:courseId", 
// [tokenAuthorization, isStudent],
subscription_1.default.rejectSubscription);
exports.default = router;
