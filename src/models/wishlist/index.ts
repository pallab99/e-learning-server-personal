import mongoose, { Document, Schema } from "mongoose";

interface IWishlist extends Document {
  user: Schema.Types.ObjectId;
  courses?: mongoose.Types.ObjectId[];
  totalCourses?: number;
}

const wishlistSchema: Schema<IWishlist> = new Schema<IWishlist>(
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

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
export { WishlistModel };
