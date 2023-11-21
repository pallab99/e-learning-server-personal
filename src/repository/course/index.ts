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

  async getCourseByInstructor(instructorId: string, searchTerm: string) {
    const query = {
      instructors: { $in: [instructorId] },
      title: { $regex: searchTerm, $options: "i" },
    };

    return await CourseModel.find(query).sort({ updatedAt: -1 });
  }

  async addToEnrollment(courseId: string, userId: string) {
    return await CourseModel.updateOne(
      { _id: new mongoose.Types.ObjectId(courseId) },
      { $push: { students: userId } }
    );
  }
  async userEnrolledInCourse(courseId: string, userId: string) {
    return await CourseModel.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      students: userId,
    });
  }
}

const CourseRepository = new CourseRepositoryClass();
export default CourseRepository;
