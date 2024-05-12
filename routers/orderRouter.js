import {
  createOrder,
  getOrders,
  updateStatus,
  getSingleOrder,
} from "../controllers/orderController.js";
import { auth } from "../middleware/auth.js";
import { Router } from "express";
const router = Router();

router.post("/createOrder", auth, createOrder);
router.get("/", auth, getOrders);
router
  .route("/singleOrder/:orderId")
  .patch(auth, updateStatus)
  .get(auth, getSingleOrder);
// router.get("/:orderId", );

export default router;
