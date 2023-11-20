import QuizRepository from "../../repository/quiz";

class QuizServiceClass {
  async createQuiz(quizData: any) {
    const result = await QuizRepository.createQuiz(quizData);
    return { success: result ? true : false, data: result as any };
  }

  async calculateTotalMarks(quizData: any) {
    let total_marks = 0;
    quizData.questions.forEach((element: any) => {
      total_marks += element.point;
    });
    return total_marks;
  }

  async updateQuiz(quizId: string, quizData: any) {
    const result = await QuizRepository.findByIdAndUpdate(quizId, quizData);

    return { success: result ? true : false, data: result as any };
  }
  async findById(quizId: string) {
    const result = await QuizRepository.findById(quizId);
    return { success: result ? true : false, data: result as any };
  }

  async deleteQuestion(quizId: string, questionId: string) {
    const result = await QuizRepository.deleteQuestion(quizId, questionId);

    return { success: result ? true : false, data: result as any };
  }
}
const QuizService = new QuizServiceClass();
export default QuizService;
