import { Order } from "../models/order.js";
import Products from "../models/product.js";
import asyncHandler from "express-async-handler";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    cart,
    shippingAddress,
    user,
    totalPrice,
    paymentInfo,
    OrderStatus,
    deliveryDate,
  } = req.body;
  const { userId } = req.user;

  // if (!cart || !shippingAddress || !user || !totalPrice) {
  //   return res.status(400).json({
  //     success: false,
  //     error:
  //       "Missing required fields. Please provide all details for the order.",
  //   });
  // }

  const newOrder = new Order({
    cart,
    shippingAddress,
    user: userId,
    totalPrice,
    paymentInfo,
    OrderStatus,
    deliveryDate,
  });

  const saveOrder = await newOrder.save();

  res
    .status(200)
    .json({ success: true, message: "Order Created Successfully", saveOrder });
});

export const getOrders = asyncHandler(async (req, res) => {
  const order = await Order.find().sort("-createdAt").populate({
    path: "user",
    select: "-password"
  });

  res.status(200).json({
    success: true,
    message: "Your Orders",
    numOfOrders: order.length,
    order,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { OrderStatus, deliveryDate } = req.body;

  if (!orderId) {
    throw new Error(" orderId is required");
  }

  let updatedStatus = {};

  if (OrderStatus) updatedStatus.OrderStatus = OrderStatus;
  if (deliveryDate) updatedStatus.deliveryDate = deliveryDate;

  const order = await Order.findByIdAndUpdate(orderId, updatedStatus, {
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

export const getSingleOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(404).json({
      success: false,
      message: "Single Order not found",
    });
  }

  const order = await Order.findById({ _id: orderId });
  res.status(200).json({
    success: true,
    message: "Single Order found",
    order,
  });
});
