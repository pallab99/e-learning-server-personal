import { QuizSubmissionModel } from "../../models/quiz-submission";
import { IQuizSubmissionData } from "../../types/quizSubmission";

class QuizSubmitRepositoryClass {
  async submitQuiz(submitQuizData: IQuizSubmissionData) {
    return await QuizSubmissionModel.create(submitQuizData);
  }
}
const QuizSubmitRepository = new QuizSubmitRepositoryClass();
export default QuizSubmitRepository;
