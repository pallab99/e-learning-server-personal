import mongoose, { Document, Schema } from "mongoose";

interface IReviewRating extends Document {
  user: Schema.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  reviewMessage: string;
  rating: number;
}

const reviewRatingSchema: Schema<IReviewRating> = new Schema<IReviewRating>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    reviewMessage: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewRatingModel = mongoose.model<IReviewRating>(
  "ReviewRating",
  reviewRatingSchema
);
export { ReviewRatingModel };
