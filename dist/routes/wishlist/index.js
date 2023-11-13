"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const wishlist_1 = __importDefault(require("../../controllers/wishlist"));
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], wishlist_1.default.addToWishlist)
    .get("/details", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], wishlist_1.default.getWishlistByUserId)
    .patch("/update", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], wishlist_1.default.updateWishlist);
exports.default = router;
