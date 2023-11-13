import mongoose, { Document, Schema } from "mongoose";

interface IAuth extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  rank: number;
  user: Schema.Types.ObjectId;
  resetPassword: boolean | null;
  resetPasswordToken: string | null;
  resetPasswordExpired: Date | null | number;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const authSchema: Schema<IAuth> = new Schema<IAuth>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be minimum 8 characters"],
      max: [15, "Password can not be greater than 15 characters"],
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    rank: {
      type: Number,
      default: 3,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resetPassword: {
      type: Boolean || null,
      required: false,
      default: false,
    },
    resetPasswordToken: {
      type: String || null,
      required: false,
      default: null,
    },
    resetPasswordExpired: {
      type: Date || null,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const AuthModel = mongoose.model<IAuth>("Auth", authSchema);
export { AuthModel };
