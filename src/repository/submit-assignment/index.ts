import mongoose from "mongoose";
import SubmitAssignmentModel from "../../models/submit-assignment";
import { ISubmitAssignment } from "../../types/submitAssignment";

class SubmitAssignmentRepositoryClass {
  async submitAssignment(assignmentData: ISubmitAssignment) {
    console.log(assignmentData);

    return await SubmitAssignmentModel.create({
      title: assignmentData.title,
      description: assignmentData.description,
      comments: assignmentData.comments,
      course: assignmentData.course,
      courseSection: assignmentData.courseSection,
      student: assignmentData.student,
      assignment: assignmentData.assignment,
      assignmentFileURL: assignmentData.assignmentFileURL,
    });
  }

  async getAllSubmittedAssignmentByCourseId(courseId: string) {
    return await SubmitAssignmentModel.find({
      course: new mongoose.Types.ObjectId(courseId),
    })
      .populate("assignment")
      .populate("student")
      .populate("courseSection");
  }
  async findById(assignmentId: string) {
    return await SubmitAssignmentModel.find({
      assignment: new mongoose.Types.ObjectId(assignmentId),
    })
      .populate("assignment")
      .populate("student")
      .populate("courseSection"); 
  }

  async submitAssessment(
    submittedAssignmentId: string,
    grade: number,
    feedback?: string
  ) {
    return await SubmitAssignmentModel.findByIdAndUpdate(
      submittedAssignmentId,
      { grade: grade, feedback: feedback },
      { new: true }
    );
  }
}
const SubmitAssignmentRepository = new SubmitAssignmentRepositoryClass();
export default SubmitAssignmentRepository;
