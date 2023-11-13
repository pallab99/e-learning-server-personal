import SubscriptionRepository from "../../repository/subscription";

class SubscriptionServiceClass {
  async applySubscription(userId: string, courses: any) {
    const result = await SubscriptionRepository.applySubscription(
      userId,
      courses
    );
    return { success: result ? Object.keys(result).length : 0, data: result };
  }
  async getAllSubscriptionListPopulated() {
    const result =
      await SubscriptionRepository.getAllSubscriptionListPopulated();
    return { success: result ? result.length : 0, data: result };
  }

  async findByIdPopulated(subscriptionId: string) {
    const result =
      await SubscriptionRepository.findByIdPopulated(subscriptionId);
    return { success: result ? 1 : 0, data: result as any };
  }
  async removeCourseFromSubscriptionList(subscription: any, courseId: string) {
    console.log(subscription);

    const index = subscription.courses.findIndex((ele: any) => {
      return String(ele._id) === String(courseId);
    });
    if (index != -1) {
      subscription.courses.splice(index, 1);
      await subscription.save();
      if (subscription.courses.length <= 0) {
        await SubscriptionRepository.findByIdAndDelete(subscription._id);
      }
      return { success: true, data: subscription as any };
    }
    return { success: false, data: [] as any };
  }

  async removeSubscription(subscriptionId: string) {
    const result =
      await SubscriptionRepository.getAllSubscriptionListPopulated();
    return { success: result ? 1 : 0, data: result as any };
  }
}
const SubscriptionService = new SubscriptionServiceClass();
export default SubscriptionService;
