import mongoose from "mongoose";
import { CartModel } from "../../models/cart";

class CartRepositoryClass {
  async findCartByUserId(userID: string) {
    return await CartModel.findOne({
      user: new mongoose.Types.ObjectId(userID),
    });
  }
  async findCartByUserIdPopulated(userID: string) {
    return await CartModel.findOne({
      user: new mongoose.Types.ObjectId(userID),
    }).populate({
      path: "courses",
      populate: {
        path: "instructors",
      },
    });
  }

  async createNewCart(userId: string, courseId: string) {
    return await CartModel.create({
      user: userId,
      courses: [courseId],
      totalCourses: 1,
    });
  }

  async findByIdPopulated(cartId: string) {
    return await CartModel.findById(cartId).populate("user");
  }

  async removeCart(cartId: string) {
    return await CartModel.findByIdAndDelete(cartId, { new: true });
  }

  async removeCourseFromCart(cartId: string, courseId: string) {
    return await CartModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(cartId) },
      { $pull: { courses: courseId } }
    );
  }
}

const CartRepository = new CartRepositoryClass();
export default CartRepository;
