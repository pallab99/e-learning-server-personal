import { SubscriptionModel } from "../../models/subscription";

class SubscriptionRepositoryClass {
  async applySubscription(userId: string, courses: any) {
    return await SubscriptionModel.create({ user: userId, courses: courses });
  }
  async getAllSubscriptionListPopulated() {
    return await SubscriptionModel.find({})
      .populate("user")
      .populate("courses");
  }
  async findByIdPopulated(subscriptionId: string) {
    return await SubscriptionModel.findById(subscriptionId)
      .populate("user")
      .populate("courses");
  }

  async findByIdAndDelete(subscriptionId: string) {
    return await SubscriptionModel.findByIdAndDelete(subscriptionId, {
      new: true,
    });
  }
}
const SubscriptionRepository = new SubscriptionRepositoryClass();
export default SubscriptionRepository;
