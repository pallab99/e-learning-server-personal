import mongoose from "mongoose";
import CourseModel from "../../models/course";

class CourseRepositoryClass {
  async save(entity: any) {
    return entity.save();
  }

  async findByTitle(title: string) {
    return await CourseModel.find({ title });
  }
  async findById(id: string) {
    return await CourseModel.findById(id);
  }

  async userAvailableInCourse(courseId: string, userId: string) {
    return await CourseModel.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      students: { $in: [userId] },
    });
  }

  async getCourseByInstructor(instructorId: string) {
    return await CourseModel.find({ instructors: { $in: [instructorId] } });
  }
}

const CourseRepository = new CourseRepositoryClass();
export default CourseRepository;
