import express from "express";
import { validator } from "../../middlewares/validator";
import CourseContentController from "../../controllers/course-content";
import { upload } from "../../configs/file";
import CartController from "../../controllers/cart";
import {
  isStudent,
  tokenAuthorization,
} from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post("/create", [tokenAuthorization, isStudent], CartController.addToCart)
  .get(
    "/details",
    [tokenAuthorization, isStudent],
    CartController.getCartByUserId
  )
  .patch("/update", [tokenAuthorization, isStudent], CartController.updateCart);

export default router;
