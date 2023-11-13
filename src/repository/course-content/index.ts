import mongoose from "mongoose";
import CourseContentModel from "../../models/course-content/courseContent";

class CourseContentRepositoryClass {
  async getCourseContentBySectionId(id: string) {
    return await CourseContentModel.find({
      courseSection: new mongoose.Types.ObjectId(id),
    });
  }
  async findById(id: string) {
    return await CourseContentModel.findById(id);
  }
  async findByIdAndDelete(id: string) {
    return await CourseContentModel.findByIdAndDelete(id);
  }
}

const CourseContentRepository = new CourseContentRepositoryClass();
export default CourseContentRepository;
