import mongoose, { Document, Schema } from "mongoose";

interface ISubmitAssignment extends Document {
  title: string;
  description: string;
  assignmentFileURL: string;
  comments?: string[];
  disabled?: boolean;
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  courseSection: Schema.Types.ObjectId;
  assignment: Schema.Types.ObjectId;
  grade?: number;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const submitAssignmentSchema: Schema<ISubmitAssignment> =
  new Schema<ISubmitAssignment>(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      comments: {
        type: [String],
        required: false,
      },
      assignmentFileURL: {
        type: String,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseSection: {
        type: Schema.Types.ObjectId,
        ref: "CourseSection",
        required: true,
      },
      course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
      assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
      },
      grade: {
        type: Number,
        required: false,
      },
      feedback: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  );

const SubmitAssignmentModel = mongoose.model<ISubmitAssignment>(
  "SubmitAssignment",
  submitAssignmentSchema
);
export default SubmitAssignmentModel;
