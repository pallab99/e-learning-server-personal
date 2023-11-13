"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const express_validator_1 = require("express-validator");
const { body, param } = require("express-validator");
const containsSpecialCharacters = (value) => {
    const specialCharactersRegex = SPECIAL_CHARACTERS;
    return !specialCharactersRegex.test(value);
};
exports.validator = {
    addBalance: [
        body("amount")
            .exists()
            .withMessage("Amount is required")
            .custom((value) => {
            if (typeof value != "number") {
                throw new Error("Amount must be a number");
            }
            if (value <= 0 || isNaN(value) || value > 30000) {
                throw new Error("Amount must be a positive number less than 30000");
            }
            else {
                return true;
            }
        }),
    ],
    updateUser: [
        body("name")
            .optional()
            .isString()
            .withMessage("Name only be a string")
            .bail()
            .custom((value) => {
            if (value.trim() === "") {
                throw new Error("Name is required");
            }
            else {
                return true;
            }
        })
            .bail()
            .isLength({ max: 50 })
            .withMessage("Name cannot be greater than 50"),
        body("phoneNumber")
            .optional()
            .not()
            .equals("")
            .withMessage("PhoneNumber is required")
            .bail()
            .isNumeric()
            .withMessage("PhoneNumber must be a number"),
        body("notificationSetting")
            .optional()
            .custom((value) => {
            if (value === undefined ||
                value === null ||
                typeof value != "number" ||
                value > 1) {
                throw new Error("Invalid value provided");
            }
            else {
                return true;
            }
        }),
    ],
    createCourse: [
        (0, express_validator_1.check)("title")
            .not()
            .isEmpty()
            .withMessage("Title is required")
            .bail()
            .isString()
            .withMessage("Title must be string")
            .bail()
            .isLength({ max: 50 })
            .withMessage("Title cannot exceed 20 characters"),
        (0, express_validator_1.check)("description")
            .not()
            .isEmpty()
            .withMessage("Description is required")
            .bail()
            .isString()
            .withMessage("Description must be string")
            .bail()
            .isLength({ max: 1500 })
            .withMessage("Description cannot exceed 1500 characters"),
        (0, express_validator_1.check)("category")
            .not()
            .isEmpty()
            .withMessage("Category is required")
            .bail()
            .isString()
            .withMessage("Category must be string")
            .bail()
            .isLength({ max: 50 })
            .withMessage("Category cannot exceed 50 characters"),
        (0, express_validator_1.check)("level")
            .not()
            .isEmpty()
            .withMessage("Level is required")
            .bail()
            .isString()
            .withMessage("Category must be string"),
        (0, express_validator_1.check)("tags")
            .not()
            .isEmpty()
            .withMessage("Tags is required")
            .custom((value) => {
            console.log(value);
            const arrayValue = value.split(",");
            for (let i = 0; i < arrayValue.length; i++) {
                if (typeof arrayValue[i] !== "string") {
                    throw new Error("All elements in tags must be strings");
                }
            }
            return true;
        }),
        (0, express_validator_1.check)("benefits")
            .not()
            .isEmpty()
            .withMessage("Benefits is required")
            .custom((value) => {
            const arrayValue = value.split(",");
            for (let i = 0; i < arrayValue.length; i++) {
                if (typeof arrayValue[i] !== "string") {
                    throw new Error("All elements in benefits must be strings");
                }
            }
            return true;
        }),
        (0, express_validator_1.check)("prerequisites")
            .not()
            .isEmpty()
            .withMessage("Prerequisites is required")
            .custom((value) => {
            const arrayValue = value.split(",");
            console.log(arrayValue);
            for (let i = 0; i < arrayValue.length; i++) {
                if (typeof arrayValue[i] !== "string") {
                    throw new Error("All elements in prerequisites must be strings");
                }
            }
            return true;
        }),
    ],
    createCourseSection: [
        body("title")
            .exists()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title only be a string")
            .bail()
            .custom((value) => {
            if (value.trim() === "") {
                throw new Error("Title is required");
            }
            else {
                return true;
            }
        })
            .bail()
            .isLength({ max: 50 })
            .withMessage("Title cannot be greater than 50"),
    ],
    updateCourseSection: [
        body("title")
            .optional()
            .not()
            .equals()
            .withMessage("Title is required")
            .isString()
            .withMessage("Title only be a string")
            .bail()
            .custom((value) => {
            if (value.trim() === "") {
                throw new Error("Title is required");
            }
            else {
                return true;
            }
        })
            .bail()
            .isLength({ max: 50 })
            .withMessage("Title cannot be greater than 50"),
    ],
    addReview: [
        body("message")
            .optional()
            .not()
            .equals("")
            .withMessage("Message  cannot be empty")
            .bail()
            .isLength({ min: 5, max: 200 })
            .withMessage("Review message must be between 5 to 200 words")
            .bail()
            .custom((value) => {
            if (typeof value != "string") {
                throw new Error("Review message must be a string");
            }
            else {
                return true;
            }
        }),
        body("rating")
            .exists()
            .withMessage("Rating can not be null")
            .bail()
            .custom((value) => {
            if (typeof value != "number") {
                throw new Error("Rating must be a number");
            }
            if (!isNaN(value)) {
                if (value >= 1 && value <= 5)
                    return true;
                throw new Error("Rating must be between 1 and 5");
            }
            else {
                throw new Error("Rating only accepts numeric values");
            }
        }),
    ],
    updateReview: [
        body("message")
            .optional()
            .not()
            .equals("")
            .withMessage("Message  cannot be empty")
            .bail()
            .isLength({ min: 5, max: 200 })
            .withMessage("Review message must be between 5 to 200 words")
            .bail()
            .custom((value) => {
            if (typeof value != "string") {
                throw new Error("Review message must be a string");
            }
            if (value.trim().length === 0) {
                throw new Error("Review message can not be empty");
            }
            else {
                return true;
            }
        }),
        body("rating")
            .optional()
            .custom((value) => {
            if (typeof value != "number") {
                throw new Error("Rating must be a number");
            }
            if (!isNaN(value)) {
                if (value >= 1 && value <= 5)
                    return true;
                throw new Error("Rating must be between 1 and 5");
            }
            else {
                throw new Error("Rating only accepts numeric values");
            }
        }),
    ],
    addQNA: [
        body("courseId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        body("message")
            .isString()
            .notEmpty()
            .withMessage("Message is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Message must be between 5 and 500 characters"),
    ],
    replyToQNA: [
        param("questionId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        body("courseId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        body("reply")
            .isString()
            .notEmpty()
            .withMessage("Message is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Message must be between 5 and 500 characters"),
    ],
    updateQNA: [
        param("questionId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        param("courseId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        body("question")
            .isString()
            .notEmpty()
            .withMessage("Message is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Message must be between 5 and 500 characters"),
    ],
    updateReply: [
        param("questionId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        param("courseId")
            .isMongoId()
            .withMessage("Course ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course ID is required"),
        param("replyId")
            .isMongoId()
            .withMessage("Reply ID must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Reply ID is required"),
        body("reply")
            .isString()
            .notEmpty()
            .withMessage("Message is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Message must be between 5 and 500 characters"),
    ],
    addQuiz: [
        body("title")
            .isString()
            .notEmpty()
            .withMessage("Title is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 100 })
            .withMessage("Title must be between 5 and 500 characters"),
        body("description")
            .isString()
            .notEmpty()
            .withMessage("Description is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Description must be between 5 and 500 characters"),
        body("courseSection")
            .isMongoId()
            .withMessage("Course Section must be a valid MongoDB ID")
            .bail()
            .notEmpty()
            .withMessage("Course Section is required"),
        body("questions.*.question")
            .isString()
            .notEmpty()
            .withMessage("Question is required and must be a string")
            .bail()
            .isLength({ min: 10, max: 200 })
            .withMessage("Question must be between 10 and 200 characters"),
        body("questions.*.options")
            .isArray({ min: 4, max: 5 })
            .withMessage("Options must be an array with at least 4 options"),
        body("questions.*.correctAnswer")
            .notEmpty()
            .isNumeric()
            .withMessage("Correct answer should be numeric")
            .bail()
            .toInt()
            .isInt({ min: 1, max: 4 })
            .withMessage("Correct Answer must be an integer between 1 and 4"),
        body("questions.*.point")
            .isInt({ min: 1 })
            .withMessage("Point must be an integer and greater than 0"),
    ],
    updateQuiz: [
        body("title")
            .isString()
            .optional()
            .withMessage("Title is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 100 })
            .withMessage("Title must be between 5 and 500 characters"),
        body("description")
            .isString()
            .optional()
            .withMessage("Description is required and must be a string")
            .bail()
            .isLength({ min: 5, max: 500 })
            .withMessage("Description must be between 5 and 500 characters"),
        body("courseSection")
            .isMongoId()
            .withMessage("Course Section must be a valid MongoDB ID")
            .bail()
            .optional()
            .withMessage("Course Section is required"),
        body("questions.*.question")
            .isString()
            .optional()
            .withMessage("Question is required and must be a string")
            .bail()
            .isLength({ min: 10, max: 200 })
            .withMessage("Question must be between 10 and 200 characters"),
        body("questions.*.options")
            .isArray({ min: 4, max: 5 })
            .withMessage("Options must be an array with at least 4 options"),
        body("questions.*.correctAnswer")
            .optional()
            .isNumeric()
            .withMessage("Correct answer should be numeric")
            .bail()
            .toInt()
            .isInt({ min: 1, max: 4 })
            .withMessage("Correct Answer must be an integer between 1 and 4"),
        body("questions.*.point")
            .isInt({ min: 1 })
            .withMessage("Point must be an integer and greater than 0"),
    ],
};
