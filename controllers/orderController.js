import { Order } from "../models/order.js";
import Products from "../models/product.js";
import asyncHandler from "express-async-handler";

export const createOrder = asyncHandler(async (req, res) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo, OrderStatus } =
    req.body;

  // if (!cart || !shippingAddress || !user || !totalPrice) {
  //   return res.status(400).json({
  //     success: false,
  //     error:
  //       "Missing required fields. Please provide all details for the order.",
  //   });
  // }
  console.log(req.body);

  const newOrder = new Order({
    cart,
    shippingAddress,
    user,
    totalPrice,
    paymentInfo,
    OrderStatus,
  });

  const saveOrder = await newOrder.save();

  res
    .status(200)
    .json({ success: true, message: "Order Created Successfully", saveOrder });
});

export const getOrders = asyncHandler(async (req, res) => {
  const order = await Order.find().sort("-createdAt");

  res
    .status(200)
    .json({
      success: true,
      message: "Your Orders",
      numOfOrders: order.length,
      order,
    });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { OrderStatus } = req.body;
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { OrderStatus },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators for update
      }
    );

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
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});
