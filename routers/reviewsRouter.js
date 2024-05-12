import { Router } from "express";

import {
  createReview,
  getReview,
  getReviewsForProducts,
} from "../controllers/reviewsController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// router.route("/").post(auth, createReview).get(auth, getReview);
router.post("/:productId/reviews", auth, createReview);
router.get("/:productId", getReviewsForProducts);
router.get("/", auth, getReview);

export default router;
