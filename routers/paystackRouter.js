import { Router } from "express";
import {
  paystack,
  getPayment,
  verifyPaymentDetails,
} from "../controllers/paystackController.js";

const router = Router();

router.route("/").post(paystack);
router.get("/", getPayment);
router.get("/verify/:verifyId", verifyPaymentDetails);

export default router;
