import mongoose, { Document, Schema } from "mongoose";

export interface IReply {
  message: string;
  user: Schema.Types.ObjectId;
  reply: {
    message: string;
    user: Schema.Types.ObjectId;
    likes: number;
  }[];
}

interface IQNA extends Document {
  course: Schema.Types.ObjectId;
  likes?: number;
  messages?: IReply[];
}

const qnaSchema: Schema<IQNA> = new Schema<IQNA>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    messages: [
      {
        message: {
          type: String,
          required: true,
        },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        likes: { type: Number, required: false, default: 0 },
        reply: [
          {
            message: {
              type: String,
              required: true,
            },
            user: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            likes: { type: Number, required: false, default: 0 },
          },
        ],
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

const QNAModel = mongoose.model<IQNA>("QNA", qnaSchema);
export { QNAModel };
