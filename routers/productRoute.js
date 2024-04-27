import { Router } from "express";
import {
  createProduct,
  getProduct,
  getAProduct,
  deleteAProduct,
  updateProduct,
  getByCategory,
  getByCategoryAndGender,
  getRecentProduct,
  getByCategoryAndTags,
} from "../controllers/productController.js";
import { auth, permission } from "../middleware/auth.js";

const router = Router();

router
  .route("/")
  .post(auth, permission("admin"), createProduct)
  .get(getProduct);
router.get("/recent/:gender", getRecentProduct);
router
  .route("/:productId")
  .get(getAProduct)
  .delete(auth, permission("admin"), deleteAProduct)
  .patch(updateProduct);

router.get("/category/:category", getByCategory);
router.get("/category/:category/tags/:tags", getByCategoryAndTags);
router.get("/category/:category/gender/:gender", getByCategoryAndGender);

export default router;
