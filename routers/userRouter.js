import { Router } from "express";
import {
  register,
  login,
  getUser,
  forgottenPassword,
  resetPassword,
  logout,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/", getUser);
router.post("/forgot-Password", forgottenPassword);
router.patch("/reset-Password/:token", resetPassword);

export default router;
