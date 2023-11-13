"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = __importDefault(require("../../controllers/cart"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], cart_1.default.addToCart)
    .get("/details", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], cart_1.default.getCartByUserId)
    .patch("/update", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], cart_1.default.updateCart);
exports.default = router;
