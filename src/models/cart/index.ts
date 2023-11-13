import mongoose, { Document, Schema } from "mongoose";

interface ICart extends Document {
  user: Schema.Types.ObjectId;
  courses?: mongoose.Types.ObjectId[];
  totalCourses?: number;
}

const cartSchema: Schema<ICart> = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course", required: false }],
    totalCourses: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export { CartModel };
