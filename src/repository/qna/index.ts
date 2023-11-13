import mongoose from "mongoose";
import { QNAModel } from "../../models/QNA";

class QNARepositoryClass {
  async findQNAByCourseId(courseId: string) {
    return await QNAModel.findOne({
      course: new mongoose.Types.ObjectId(courseId),
    });
  }
  async createQNA(message: string, courseId: string, userId: string) {
    return await QNAModel.create({
      course: courseId,
      messages: [
        {
          message: message,
          user: userId,
          reply: [],
        },
      ],
    });
  }
  async replyToQuestion(questionId: string, replyData: any) {
    return await QNAModel.updateOne(
      { "messages._id": questionId },
      { $push: { "messages.$.reply": replyData } }
    );
  }

  async updateQuestion(questionId: string, question: string) {
    return await QNAModel.updateOne(
      { "messages._id": questionId },
      { $set: { "messages.$.message": question } },
      { new: true }
    );
  }
  async updateReply(questionId: string, replyId: string, reply: string) {
    return await QNAModel.updateOne(
      { "messages._id": questionId },
      { $set: { "messages.$[message].reply.$[reply].message": reply } },
      {
        arrayFilters: [{ "message._id": questionId }, { "reply._id": replyId }],
      }
    );
  }
  async deleteReply(qnaId: string, questionId: string, replyId: string) {
    return await QNAModel.updateOne(
      { _id: qnaId, 'messages._id': questionId },
      { $pull: { 'messages.$.reply': { _id: replyId } } }
    );
  }
  async deleteQuestion(qnaId: string, questionId: string) {
    return await QNAModel.updateOne(
      { _id: qnaId },
      { $pull: { messages: { _id: questionId } } }
    );
  }
}

const QNARepository = new QNARepositoryClass();
export default QNARepository;
