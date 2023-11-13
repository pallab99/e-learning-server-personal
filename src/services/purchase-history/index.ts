import PurchaseHistoryRepository from "../../repository/purchase-history";

class PurchaseHistoryServiceClass {
  async createPurchase(userId: string, courseId: string) {
    const result = await PurchaseHistoryRepository.createPurchase(
      userId,
      courseId
    );
    return { success: result ? 1 : 0, data: result as any };
  }

  async getAllPurchase() {
    const result = await PurchaseHistoryRepository.getAllPurchase();
    return { success: result && result.length ? 1 : 0, data: result as any };
  }
  async findById(purchaseId: string) {
    const result = await PurchaseHistoryRepository.findById(purchaseId);
    return { success: result ? 1 : 0, data: result as any };
  }
  async findByUser(userId: string) {
    const result = await PurchaseHistoryRepository.findByUserId(userId);
    return { success: result && result.length ? 1 : 0, data: result as any };
  }
}

const PurchaseHistoryService = new PurchaseHistoryServiceClass();
export default PurchaseHistoryService;
