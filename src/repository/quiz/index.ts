import mongoose from "mongoose";
import { QuizModel } from "../../models/quiz";

class QuizRepositoryClass {
  async createQuiz(quizData: any) {
    return await QuizModel.create(quizData);
  }
  async findByIdAndUpdate(quizId: string, quizData: any) {
    return await QuizModel.findByIdAndUpdate(quizId, quizData, { new: true });
  }

  async findById(quizId: string) {
    return await QuizModel.findByIdAndUpdate(quizId);
  }

  async deleteQuestion(quizId: string, questionId: string) {
    return await QuizModel.updateOne(
      { _id: new mongoose.Types.ObjectId(quizId) },
      { $pull: { questions: { _id: new mongoose.Types.ObjectId(questionId) } } }
    );
  }
}
const QuizRepository = new QuizRepositoryClass();
export default QuizRepository;
