import mongoose, { Document, Schema } from "mongoose";

interface IQuiz extends Document {
  courseSection: Schema.Types.ObjectId;
  title: string;
  disable?: boolean;
  questions: [
    {
      question: string;
      options: [string];
      correctAnswer: number;
      point: number;
    },
  ];
}

const quizSchema: Schema<IQuiz> = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    courseSection: {
      type: Schema.Types.ObjectId,
      ref: "CourseSection",
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
        point: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const QuizModel = mongoose.model<IQuiz>("Quiz", quizSchema);
export { QuizModel };
