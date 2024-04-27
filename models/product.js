import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    // images: {
    //   type: [],
    //   required: true,
    // },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["skin", "clothes", "shoes", "bodysuits", "lounge"],
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "out"],
      default: "active",
    },

    tags: {
      type: String,
      required: true,
      enum: [
        "skincare",
        "haircare",
        "bodycare",
        "sunprotection",
        "makeup",
        "men",
        "womenMen",
        "scentfree",
        "toothpaste",
      ],
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },

    price: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    size: {
      type: String,
      required: true,
      enum: ["s", "m", "l", "xl", "xxl"],
    },

    details: {
      type: String,
      required: true,
    },

    shipping: {
      type: String,
      required: true,
    },

    returns: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",       
      },
    ],
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", productSchema);

export default Products;
