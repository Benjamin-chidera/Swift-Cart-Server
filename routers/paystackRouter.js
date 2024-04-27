import { Router } from "express";
import { paystack, getPayment } from "../controllers/paystackController.js";

const router = Router();

router.route("/").post(paystack)
router.get("/", getPayment)

export default router;
