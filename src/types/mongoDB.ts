import mongoose from "mongoose";

export interface IMongoID {
  id?: mongoose.Types.ObjectId;
}
