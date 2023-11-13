"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_rating_1 = __importDefault(require("../../controllers/review-rating"));
const tokenValidator_1 = require("../../middlewares/tokenValidator");
const validator_1 = require("../../middlewares/validator");
const router = express_1.default.Router();
router
    .post("/create/:courseId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent, ...validator_1.validator.addReview], review_rating_1.default.addReviewRating)
    .patch("/update/:reviewId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent, ...validator_1.validator.updateReview], review_rating_1.default.updateReviewRating)
    .get("/all/:courseId", review_rating_1.default.getReviewByCourseId)
    .delete("/delete/:courseId/:reviewId", [tokenValidator_1.tokenAuthorization, tokenValidator_1.isStudent], review_rating_1.default.deleteReview);
exports.default = router;
