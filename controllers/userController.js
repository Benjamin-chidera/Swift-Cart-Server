import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please necessary Information");
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("Email already in use");
  }

  const imageResult = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "Ecommerce",
    }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  const hashed = await bcrypt.hash(password, 10);

  const registerUser = await User.create({
    name,
    password: hashed,
    email,
    role,
    image: imageResult.secure_url,
  });

  const token = jwt.sign(
    {
      userId: registerUser._id,
      name: registerUser.name,
      image: registerUser.image,
      role: registerUser.role,
      email: registerUser.email,
    },
    process.env.TOKEN,
    {
      expiresIn: "30d",
    }
  );

  // res.cookie("userToken", token, { maxAge: 3600000, httpOnly: true });

  res.status(201).json({
    success: true,
    registerUser: {
      name: registerUser.name,
      email: registerUser.email,
      password: registerUser.password,
      image: registerUser.image,
      role: registerUser.role,
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      image: user.image,
      role: user.role,
      email: user.email,
    },
    process.env.TOKEN,
    {
      expiresIn: "30d",
    }
  );

  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      token,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("userToken");

  res.send("User logged out successfully");
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password");

  res.status(200).json({ success: true, user });
});

export const forgottenPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(`User not found`);
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name, image: user.image, role: user.role },
    process.env.TOKEN,
    {
      expiresIn: "10d",
    }
  );

  const resetLink = `http://localhost:5173/reset-password/${token}`; //added in the frontend
  const subject = "Password Reset Request";
  const message = `To reset your password, click on the following link: ${resetLink}`;
  const send_to = email;
  const sent_from = process.env.EMAIL_USER; // Your email address
  const reply_to = email;

  await sendEmail(subject, message, send_to, reply_to, sent_from);
  res
    .status(200)
    .json({ success: true, msg: "Email sent successfully", token });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  const decodedToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodedToken.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error({ msg: "user not found" });
  }

  const hased = await bcrypt.hash(password, 10);

  user.password = hased;

  await user.save();
  res.status(200).json({ msg: "Password successfully changed", success: true });
});
