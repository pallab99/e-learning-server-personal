import mongoose, { Schema } from "mongoose";

interface ICourseContentDocument extends Document {
  contentTitle: string;
  contentUrl: string;
  contentLength: number;
  course: Schema.Types.ObjectId;
  courseSection: Schema.Types.ObjectId;
  disable?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
const courseContentSchema: Schema<ICourseContentDocument> =
  new Schema<ICourseContentDocument>(
    {
      contentTitle: {
        type: String,
        required: true,
      },
      contentUrl: {
        type: String,
        required: true,
      },
      contentLength: {
        type: Number,
        required: true,
      },
      disable:{
        type:Boolean,
        required:false,
        default:false
      },
      course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
      courseSection: {
        type: Schema.Types.ObjectId,
        ref: "CourseSection",
        required: true,
      },
    },
    { timestamps: true }
  );

const CourseContentModel = mongoose.model<ICourseContentDocument>(
  "CourseContent",
  courseContentSchema
);
export default CourseContentModel;
