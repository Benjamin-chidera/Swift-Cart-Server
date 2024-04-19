import { Router } from "express";
import {
  register,
  login,
  getUser,
  forgottenPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/", getUser);
router.post("/forgot-Password", forgottenPassword);
router.patch("/reset-Password/:token", resetPassword);

export default router;
