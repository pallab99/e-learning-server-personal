import mongoose, { Document, Schema } from "mongoose";

interface IQuizSubmission extends Document {
  userId: Schema.Types.ObjectId;
  courseSection: Schema.Types.ObjectId;
  quizId: Schema.Types.ObjectId;
  answers: [
    {
      selectedOption: number;
    },
  ];
  obtainedMarks: number;
}

const quizSubmissionSchema: Schema<IQuizSubmission> =
  new Schema<IQuizSubmission>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseSection: {
        type: Schema.Types.ObjectId,
        ref: "CourseSection",
        required: true,
      },
      quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
      },
      answers: [
        {
          type: Number,
          required: true,
        },
      ],
      obtainedMarks: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

const QuizSubmissionModel = mongoose.model<IQuizSubmission>(
  "QuizSubmission",
  quizSubmissionSchema
);
export { QuizSubmissionModel };
