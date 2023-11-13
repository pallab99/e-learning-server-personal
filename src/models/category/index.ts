import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  title: string;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);
export { CategoryModel };
