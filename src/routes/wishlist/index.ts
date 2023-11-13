import express from "express";

import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
import WishlistController from "../../controllers/wishlist";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isStudent],
    WishlistController.addToWishlist
  )
  .get(
    "/details",
    [tokenAuthorization, isStudent],
    WishlistController.getWishlistByUserId
  )
  .patch(
    "/update",
    [tokenAuthorization, isStudent],
    WishlistController.updateWishlist
  );

export default router;
