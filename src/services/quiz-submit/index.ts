import QuizSubmitRepository from "../../repository/quiz submission";
import { IQuizSubmissionData } from "../../types/quizSubmission";

class QuizSubmitServiceClass {
  calculateMarks(userAnsArray: Array<number>, correctAnswer: Array<number>) {
    let marks = userAnsArray
      .map((value, index) => (value === correctAnswer[index] ? 1 : 0))
      .reduce((a: number, b: number) => a + b, 0);

    return marks;
  }
  async submitQuiz(quizSubmitData: IQuizSubmissionData) {
    const result = await QuizSubmitRepository.submitQuiz(quizSubmitData);
    return { success: result ? true : false, data: result as any };
  }
}
const QuizSubmitService = new QuizSubmitServiceClass();
export default QuizSubmitService;
