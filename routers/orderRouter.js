import {
  createOrder,
  getOrders,
  updateStatus,
} from "../controllers/orderController.js";
import { Router } from "express";
const router = Router();

router.post("/createOrder", createOrder);
router.get("/", getOrders);
router.patch("/:orderId", updateStatus);

export default router;
