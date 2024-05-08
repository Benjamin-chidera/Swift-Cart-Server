import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    cart: {
      type: Array,
      required: true,
    },

    shippingAddress: {
      type: Object,
      required: true,
    },

    user: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "In progress", "Delivered"],
      default: "Processing",
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
