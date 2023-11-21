"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMatchStage = void 0;
function buildMatchStage(search, instructors, category, filterCategory, filterLevel, filterTotalHours) {
    const matchStage = {};
    // Search
    if (search) {
        matchStage.$or = [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    // Filter by instructors
    if (instructors) {
        matchStage.instructors = { $in: instructors };
    }
    // Filter by category
    if (category) {
        matchStage.category = category;
    }
    // Filter by category, level, and totalHours
    if (filterCategory || filterLevel || filterTotalHours) {
        if (filterCategory) {
            console.log({ filterCategory });
            matchStage["category.title"] = { $in: filterCategory };
        }
        if (filterLevel) {
            matchStage.level = filterLevel;
        }
        if (filterTotalHours) {
            matchStage.totalHours = {
                $gte: parseInt(filterTotalHours),
            };
        }
    }
    return matchStage;
}
exports.buildMatchStage = buildMatchStage;
