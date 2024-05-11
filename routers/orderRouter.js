import {
  createOrder,
  getOrders,
  updateStatus,
  getSingleOrder,
} from "../controllers/orderController.js";
import { Router } from "express";
const router = Router();

router.post("/createOrder", createOrder);
router.get("/", getOrders);
router.route("/singleOrder/:orderId").patch(updateStatus).get(getSingleOrder);
// router.get("/:orderId", );

export default router;
