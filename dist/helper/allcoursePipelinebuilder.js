"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMatchStage = void 0;
function buildMatchStage(search, instructors, category, filterCategory, filterLevel, filterTotalHours) {
    const matchStage = { $or: [] };
    // Search
    if (search) {
        matchStage.$or.push({ title: { $regex: search, $options: "i" } }, { sub_title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } });
    }
    // Filter by instructors
    if (instructors) {
        matchStage.$or.push({ instructors: { $in: instructors } });
    }
    // Filter by category, level, and totalHours
    if (filterCategory || filterLevel || filterTotalHours) {
        if (filterCategory.length) {
            matchStage.$or.push({ "category.title": { $in: filterCategory } });
        }
        if (filterLevel) {
            matchStage.$or.push({ level: filterLevel });
        }
        if (filterTotalHours) {
            matchStage.$or.push({ totalHours: { $gte: parseInt(filterTotalHours) } });
        }
    }
    // If $or array is empty, return an empty object
    if (matchStage.$or.length === 0) {
        return {};
    }
    return matchStage;
}
exports.buildMatchStage = buildMatchStage;
