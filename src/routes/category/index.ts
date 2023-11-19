import express from "express";
import CategoryController from "../../controllers/category";
import { isAdmin, tokenAuthorization } from "../../middlewares/tokenValidator";
const router = express.Router();

router
  .post(
    "/create",
    [tokenAuthorization, isAdmin],
    CategoryController.addCategory
  )
  .get(
    "/all",
    CategoryController.getAllCategory
  );

export default router;
