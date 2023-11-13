import mongoose, { Document, Schema } from "mongoose";

interface ISubscription extends Document {
  user: Schema.Types.ObjectId;
  courses?: mongoose.Types.ObjectId[];
}

const subscriptionSchema: Schema<ISubscription> = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
export { SubscriptionModel };
