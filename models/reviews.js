import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    comment: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      max: 5,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", reviewSchema);

export default Reviews;
