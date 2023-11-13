import mongoose, { Mongoose } from "mongoose";
import { PurchaseHistoryModel } from "../../models/purchase-history";

class PurchaseHistoryRepositoryClass {
  async createPurchase(userId: string, courseId: string) {
    return await PurchaseHistoryModel.create({
      user: userId,
      courses: courseId,
    });
  }

  async getAllPurchase() {
    return await PurchaseHistoryModel.find()
      .populate("user")
      .populate("courses");
  }
  async findById(purchaseId: string) {
    return await PurchaseHistoryModel.findById(purchaseId)
      .populate("user")
      .populate("courses");
  }
  async findByUserId(userId: string) {
    return await PurchaseHistoryModel.find({
      user: userId,
    })
      .populate("user")
      .populate("courses");
  }
}

const PurchaseHistoryRepository = new PurchaseHistoryRepositoryClass();
export default PurchaseHistoryRepository;
