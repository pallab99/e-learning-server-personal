import mongoose from "mongoose";
import AssignmentModel from "../../models/assignment";

class AssignmentRepositoryClass {
  async createAssignment(
    title: string,
    description: string,
    assignmentFileURL: string,
    courseSection: string,
    course: string,
    point: number,
    instructions?: string
  ) {
    return await AssignmentModel.create({
      title,
      description,
      instructions,
      assignmentFileURL,
      courseSection,
      course,
      point,
    });
  }

  async updateAssignment(id: string, doc: any) {
    return await AssignmentModel.findByIdAndUpdate(id, doc, { new: true });
  }
  async findById(id: string) {
    return await AssignmentModel.findById(id);
  }

  async getAssignmentByCourseId(id: string) {
    return await AssignmentModel.find({
      course: new mongoose.Types.ObjectId(id),
    }).populate("courseSection");
  }
  async getAssignmentBySectionId(id: string) {
    return await AssignmentModel.find({
      courseSection: new mongoose.Types.ObjectId(id),
    }).populate("courseSection");
  }
}

const AssignmentRepository = new AssignmentRepositoryClass();
export default AssignmentRepository;
