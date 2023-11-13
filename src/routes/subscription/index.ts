import express from "express";
import SubscriptionController from "../../controllers/subscription";
import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isStudent],
    SubscriptionController.applySubscription
  )
  .get(
    "/all",
    // [tokenAuthorization, isStudent],
    SubscriptionController.getAllSubscriptionList
  )
  .get("/details/:subscriptionId", SubscriptionController.getSubscriptionById)
  .post(
    "/accept-subscription/:subscriptionId/:courseId",
    SubscriptionController.acceptSubscription
  )
  .post(
    "/reject-subscription/:subscriptionId/:courseId",
    // [tokenAuthorization, isStudent],
    SubscriptionController.rejectSubscription
  );

export default router;
