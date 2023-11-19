"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = __importDefault(require("../../controllers/category"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const router = express_1.default.Router();
router
    .post("/create", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isAdmin], category_1.default.addCategory)
    .get("/all", category_1.default.getAllCategory);
exports.default = router;
