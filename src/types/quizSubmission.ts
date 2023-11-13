export interface IQuizSubmissionData {
  userId: string;
  courseSection: string;
  quizId: string;
  answers: Array<number>;
  obtainedMarks: number;
}
