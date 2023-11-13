import mongoose from "mongoose";
import { WishlistModel } from "../../models/wishlist";

class WishlistRepositoryClass {
  async findWishlistByUserId(userID: string) {
    return await WishlistModel.findOne({
      user: new mongoose.Types.ObjectId(userID),
    });
  }
  async findWishlistByUserIdPopulated(userID: string) {
    return await WishlistModel.findOne({
      user: new mongoose.Types.ObjectId(userID),
    }).populate("courses")
  }

  async createNewWishlist(userId: string, courseId: string) {
    return await WishlistModel.create({
      user: userId,
      courses: [courseId],
      totalCourses: 1,
    });
  }
}

const WishlistRepository = new WishlistRepositoryClass();
export default WishlistRepository;
