import mongoose, { Document, Schema } from "mongoose";

interface IPurchaseHistory extends Document {
  user: Schema.Types.ObjectId;
  courses : mongoose.Types.ObjectId;
}

const purchaseHistorySchema: Schema<IPurchaseHistory> = new Schema<IPurchaseHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courses: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

const PurchaseHistoryModel = mongoose.model<IPurchaseHistory>(
  "PurchaseHistory",
  purchaseHistorySchema
);
export { PurchaseHistoryModel };
