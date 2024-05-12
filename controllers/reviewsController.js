import Products from "../models/product.js";
import Reviews from "../models/reviews.js";
import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;
  const { userId } = req.user;

  // req.body.author = userId;

  const existingReview = await Reviews.findOne({
    product: productId,
    author: userId,
  });
  // console.log(existingReview);
  if (existingReview) {
    return res
      .status(400)
      .json({ error: "User already reviewed this product" });
  }

  const product = await Products.findById(productId);

  if (!product) {
    return res.status(404).json({ error: "Blog post not found" });
  }

  const review = new Reviews({
    comment,
    rating,
    author: userId,
    product: productId,
  });

  await review.save();

  product.comments.push(review);

  await product.save();

  res.status(201).json({ success: true, msg: "Review posted successfully" });
});

export const getReview = asyncHandler(async (req, res) => {
  //   const { productId } = req.params;
  const review = await Reviews.find().populate([
    {
      path: "author",
      select: "name image",
    },

    {
      path: "product",
      select: "name image",
    },
  ]);

  if (!review) {
    return res.status(404).json({ error: "Review post not found" });
  }

  res.status(200).json({ success: true, review });
});

export const getReviewsForProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const review = await Reviews.find({ product: productId }).populate([
    {
      path: "author",
      select: "name image",
    },
  ]);

  if (!review) {
    return res.status(404).json({ message: "No review found" });
  }

  res.status(200).json({ success: true, review });
});
