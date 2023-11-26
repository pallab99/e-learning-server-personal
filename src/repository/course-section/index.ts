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
      .populate({
        path: "sectionContent",
        match: { disable: { $eq: false } },
      })
      .populate({
        path: "assignment",
        match: { disabled: { $eq: false } },
      })
      .populate("quiz");
  }

  async courseContentForNonSubscribedStudent(id: string) {
    return await CourseSectionModel.find({
      course: new mongoose.Types.ObjectId(id),
    })
      .populate({
        path: "sectionContent",
        match: { disable: { $eq: false } },
        select: "-contentUrl",
      })
      .populate({
        path: "assignment",
        match: { disabled: { $eq: false } },
        select:"-assignmentFileURL -point -instructions"
      })
      .populate("quiz", "-questions");
  }
}

const CourseSectionRepository = new CourseSectionClassRepository();
export default CourseSectionRepository;
