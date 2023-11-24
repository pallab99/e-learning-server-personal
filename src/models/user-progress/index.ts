import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  completedLessons: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  progressPercentage?: number;
}

const userProgressSchema: Schema<IUserProgress> = new Schema<IUserProgress>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "CourseContent" }],
  },
  { timestamps: true }
);

const UserProgressModel = mongoose.model<IUserProgress>(
  "UserProgress",
  userProgressSchema
);
export default UserProgressModel;
