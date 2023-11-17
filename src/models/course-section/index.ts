import mongoose, { Document, Schema } from "mongoose";

interface ICourseSection extends Document {
  title: string;
  totalVideo?: number;
  totalHours?: number;
  isVisible?: boolean;
  sectionContent: Schema.Types.ObjectId[];
  course: Schema.Types.ObjectId;
  assignment?: Schema.Types.ObjectId;
  quiz?: Schema.Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSectionSchema: Schema<ICourseSection> = new Schema<ICourseSection>(
  {
    title: {
      type: String,
      required: true,
    },

    totalVideo: {
      type: Number,
      required: false,
      default: 0,
    },
    totalHours: {
      type: Number,
      required: false,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      required: false,
      default: 1,
    },
    sectionContent: [{ type: Schema.Types.ObjectId, ref: "CourseContent" }],
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment" },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

const CourseSectionModel = mongoose.model<ICourseSection>(
  "CourseSection",
  courseSectionSchema
);
export default CourseSectionModel;
