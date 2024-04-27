import { Router } from "express";

import { createReview, getReview } from "../controllers/reviewsController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// router.route("/").post(auth, createReview).get(auth, getReview);
router.post("/:productId/reviews", auth, createReview);
router.get("/", getReview);

export default router;
