import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: number;
  notificationSetting: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrolledCourses: mongoose.Types.ObjectId[];
  favouritesCourses: mongoose.Types.ObjectId[];
  balance: number;
  dp: string;
  profilePic?: string | never[];
  bio: string;
  heading?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  LinkedIn?: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone Number is required"],
    },
    notificationSetting: {
      type: Boolean,
      required: true,
    },
    enrolledCourses: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    },
    favouritesCourses: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    dp: {
      type: String,
      required: false,
      default:
        "https://mern-pallab-bucket.s3.eu-west-3.amazonaws.com/user/dp/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT77.jpg",
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    heading: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    LinkedIn: {
      type: String,
      required: false,
    },
    youtube: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model<IUser>("User", userSchema);
export { UserModel };
