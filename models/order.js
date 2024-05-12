import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    cart: {
      type: [
        {
          _id: { type: String },
          category: { type: String },
          color: { type: String },
          comments: [{ type: String }],
          createdAt: { type: String },
          description: { type: String },
          details: { type: String },
          gender: { type: String },
          image: { type: String },
          name: { type: String },
          price: { type: Number },
          quantity: { type: Number },
          returns: { type: String },
          shipping: { type: String },
          size: { type: String },
          status: { type: String },
          tags: { type: String },
          updatedAt: { type: String },
          _v: { type: Number },
        },
      ],
      // required: true,
    },

    shippingAddress: {
      type: {
        address: { type: String },
        city: { type: String },
        email: { type: String },
        phone: { type: String },
        price: { type: String },
      },
      // required: true,
    },

    user: {
      // type: String,
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    totalPrice: {
      type: Number,
      // required: true,
    },
    OrderStatus: {
      type: String,
      enum: ["Processing", "In progress", "Delivered"],
      default: "Processing",
    },

    deliveryDate: {
      type: Date,
    },

    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      type: {
        type: String,
      },
      paidAt: {
        type: Date,
        default: Date.now(),
      },
      deliveredAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
