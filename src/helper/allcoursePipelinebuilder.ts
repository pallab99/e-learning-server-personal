export function buildMatchStage(
  search: string,
  instructors: string[],
  category: string,
  filterCategory: string[],
  filterLevel: string,
  filterTotalHours: string
) {
const matchStage: any = {};

// Search
if (search) {
  matchStage.$or = [
    { title: { $regex: search, $options: "i" } },
    { sub_title: { $regex: search, $options: "i" } },
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
  if (filterCategory.length) {
    console.log({filterCategory});
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