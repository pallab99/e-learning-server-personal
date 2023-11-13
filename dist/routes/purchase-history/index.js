"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const purchase_history_1 = __importDefault(require("../../controllers/purchase-history"));
const router = express_1.default.Router();
router
    .get("/all", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isAdmin], purchase_history_1.default.getAllPurchase)
    .get("/details/user", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], purchase_history_1.default.getPurchaseByUser)
    .get("/details/:purchaseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isAdmin], purchase_history_1.default.getPurchaseById);
exports.default = router;
