import QNARepository from "../../repository/qna";

class QNAServiceClass {
  async findQNAByCourseId(courseId: string) {
    const result = await QNARepository.findQNAByCourseId(courseId);
    return { success: result ? true : false, data: result as any };
  }
  async createQNA(message: string, courseId: string, userId: string) {
    const result = await QNARepository.createQNA(message, courseId, userId);
    console.log(result);

    return { success: result ? true : false, data: result as any };
  }

  async addToExistingQNA(message: string, courseId: string, userId: any) {
    const result = await QNARepository.findQNAByCourseId(courseId);
    result?.messages?.push({ message: message, user: userId, reply: [] });
    const newMessage = await result?.save();
    return { success: result ? true : false, data: newMessage };
  }
  async replyToQuestion(questionId: string, userId: string, reply: string) {
    const replyData = {
      message: reply,
      user: userId,
      likes: 0,
    };
    const result = await QNARepository.replyToQuestion(questionId, replyData);
    return { success: result ? true : false, data: result };
  }
  async updateQuestion(questionId: string, message: string) {
    const result = await QNARepository.updateQuestion(questionId, message);
    return { success: result ? true : false, data: result };
  }
  async updateReply(questionId: string, replyId: string, message: string) {
    const result = await QNARepository.updateReply(
      questionId,
      replyId,
      message
    );
    return { success: result ? true : false, data: result };
  }
  async deleteQuestion(qnaId: string, questionId: string) {
    const result = await QNARepository.deleteQuestion(qnaId, questionId);
    return { success: result ? true : false, data: result };
  }
  async deleteReply(qnaId: string, questionId: string, replyId: string) {
    const result = await QNARepository.deleteReply(qnaId, questionId, replyId);
    return { success: result ? true : false, data: result };
  }
}

const QNAService = new QNAServiceClass();
export default QNAService;
