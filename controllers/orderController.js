import { Order } from "../models/order.js";
import Products from "../models/product.js";
import asyncHandler from "express-async-handler";

export const createOrder = asyncHandler(async (req, res) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

  if (!cart || !shippingAddress || !user || !totalPrice) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields. Please provide all details for the order.",
    });
  }

  const newOrder = new Order({
    cart,
    shippingAddress,
    user,
    totalPrice,
    paymentInfo,
  });

  const saveOrder = await newOrder.save();

  res
    .status(200)
    .json({ success: true, message: "Order Created Successfully", saveOrder });
});

export const getOrders = asyncHandler(async (req, res) => {
  const order = await Order.find();

  res.status(200).json({ success: true, message: "Your Orders", order });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;
  console.log(orderId, status);

  const updatedStatus = {};

  if (status) updateStatus.status = status;

  const order = await Order.findByIdAndUpdate({ _id: orderId }, updatedStatus, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});
