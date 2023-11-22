import SubmitAssignmentRepository from "../../repository/submit-assignment";
import { ISubmitAssignment } from "../../types/submitAssignment";

class SubmitAssignmentServiceClass {
  async submitAssignment(assignmentData: ISubmitAssignment) {
    const result =
      await SubmitAssignmentRepository.submitAssignment(assignmentData);
    return { success: result ? 1 : 0, data: result as any };
  }

  async getAllAssignmentByCourseId(courseId: string) {
    const result =
      await SubmitAssignmentRepository.getAllSubmittedAssignmentByCourseId(
        courseId
      );
    return { success: result && result.length ? 1 : 0, data: result as any };
  }

  async findById(assignmentId: string) {
    const result = await SubmitAssignmentRepository.findById(assignmentId);
    console.log({ result });

    return { success: result ? 1 : 0, data: result as any };
  }

  async submitAssessment(
    submittedAssignmentId: string,
    grade: number,
    feedback?: string
  ) {
    const result = await SubmitAssignmentRepository.submitAssessment(
      submittedAssignmentId,
      grade,
      feedback
    );
    return { success: result ? 1 : 0, data: result as any };
  }
}
const SubmitAssignmentService = new SubmitAssignmentServiceClass();
export default SubmitAssignmentService;
