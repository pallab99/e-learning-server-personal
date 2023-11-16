import mongoose from "mongoose";
import CourseSectionModel from "../../models/course-section";
import { ICourseSectionUpdate } from "../../types/courseSection";

class CourseSectionClassRepository {
  async findById(id: string) {
    return await CourseSectionModel.findById(id).populate("sectionContent");
  }
  async createSection(title: string, courseId: string) {
    return await CourseSectionModel.create({
      title,
      course: courseId,
    });
  }

  async updateSection(id: string, doc: ICourseSectionUpdate) {
    return await CourseSectionModel.findByIdAndUpdate(id, doc, {
      new: true,
    });
  }

  async deleteSection(id: string) {
    return await CourseSectionModel.findByIdAndDelete(id, {
      new: true,
    });
  }

  async saveCourseContentId(id: string) {
    return await CourseSectionModel.findById(id);
  }

  async getCourseSectionByCourseId(id: string) {
    return await CourseSectionModel.find({
      course: new mongoose.Types.ObjectId(id),
    })
      .populate("sectionContent")
      .populate("assignment")
      .populate("quiz");
  }
}

const CourseSectionRepository = new CourseSectionClassRepository();
export default CourseSectionRepository;
