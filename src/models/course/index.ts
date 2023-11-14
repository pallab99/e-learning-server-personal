import mongoose, { Document, Schema } from "mongoose";

interface ICourse extends Document {
  title: string;
  description: string;
  instructors: mongoose.Types.ObjectId[];
  students?: mongoose.Types.ObjectId[];
  category: string;
  tags: string[];
  thumbnail?: string;
  level: string;
  demoVideo?: string;
  benefits: string[];
  prerequisites: string[];
  courseOffering?: string;
  reviews?: mongoose.Types.ObjectId[];
  numberOfContent?: number;
  totalHours?: number;
  course_section?: mongoose.Types.ObjectId[];
  QNA?: mongoose.Types.ObjectId;
  disable?: boolean;
  verified?: boolean;
  status?: boolean;
}

const courseSchema: Schema<ICourse> = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructors: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    students: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: true,
    },
    demoVideo: {
      type: String,
      required: false,
    },
    benefits: {
      type: [String],
      required: true,
    },
    prerequisites: {
      type: [String],
      required: true,
    },
    courseOffering: {
      type: Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        required: false,
      },
    ],
    numberOfContent: {
      type: Number,
      required: false,
    },
    totalHours: {
      type: Number,
      required: false,
      default: 0,
    },
    course_section: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "CourseSection",
          required: false,
        },
      ],
    },
    QNA: {
      type: Schema.Types.ObjectId,
      ref: "QNA",
      required: false,
    },
    disable: {
      type: Boolean,
      required: false,
      default: false,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model<ICourse>("Course", courseSchema);
export default CourseModel;
