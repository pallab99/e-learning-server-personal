import express from "express";
import SubscriptionController from "../../controllers/subscription";
import {
  isAdmin,
  isStudent,
  isStudentOrAdmin,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import PurchaseHistoryController from "../../controllers/purchase-history";
const router = express.Router();

router
  .get(
    "/all",
    [tokenAuthorization, isAdmin],
    PurchaseHistoryController.getAllPurchase
  )
  .get(
    "/details/user",
    [tokenAuthorization, isStudent],
    PurchaseHistoryController.getPurchaseByUser
  )
  .get(
    "/details/:purchaseId",
    [tokenAuthorization, isAdmin],
    PurchaseHistoryController.getPurchaseById
  );

export default router;
