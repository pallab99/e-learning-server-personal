import mongoose, { Document, Schema } from "mongoose";

interface IAssignment extends Document {
  title: string;
  description: string;
  assignmentFileURL: string;
  instructions?: string;
  disabled?: boolean;
  point: number;
  course: Schema.Types.ObjectId;
  courseSection: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const assignmentSchema: Schema<IAssignment> = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: false,
      default: "",
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
    point: {
      type: Number,
      required: true,
    },
    courseSection: { type: Schema.Types.ObjectId, ref: "CourseSection" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

const AssignmentModel = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
export default AssignmentModel;
