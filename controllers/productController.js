import Products from "../models/product.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    tags,
    gender,
    price,
    color,
    quantity,
    size,
    details,
    shipping,
    returns,
    description,
    status,
  } = req.body;

  if (
    !name ||
    !category ||
    !tags ||
    !gender ||
    !price ||
    !color ||
    !quantity ||
    !size ||
    !details ||
    !shipping ||
    !description ||
    !returns
  ) {
    return res.status(400).json({
      success: false,
      error: "Please fill all required fields in the form",
    });
  }

  if (!req.files || !req.files.image || req.files.image.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Please upload at least one image" });
  }

  // const imageUploadPromise = req.files.images.map(async (image) => {
  //   try {
  //     const result = await cloudinary.uploader.upload(image.tempFilePath, {
  //       use_filename: true,
  //       folder: "ecommerce-products",
  //     });
  //     fs.unlinkSync(image.tempFilePath);
  //     return result.secure_url;
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     throw new Error("Image upload failed");
  //   }
  // });

  const imageResult = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "ecommerce-products",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);

  try {
    // const uploadedImages = await Promise.all(imageUploadPromise);

    const product = await Products.create({
      name,
      category,
      tags,
      gender,
      price,
      color,
      quantity,
      size,
      details,
      shipping,
      returns,
      description,
      status,
      // images: uploadedImages,
      image: imageResult.secure_url,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: "Product creation failed" });
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Products.find();
  console.log(typeof product);
  res
    .status(200)
    .json({ numOdProduct: product.length, success: true, product });
});

export const getAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Products.findById({ _id: productId });

  const productType = product.category;

  const similarProduct = await Products.find({ productType }).limit(13);

  res.status(200).json({ success: true, product, similarProduct });
});

export const deleteAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Products.findByIdAndDelete({ _id: productId });
  res.status(200).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    name,
    category,
    tags,
    gender,
    price,
    color,
    quantity,
    size,
    details,
    shipping,
    returns,
    description,
    status,
  } = req.body;

  const updatedProduct = {};

  // Update fields if they are provided in the request body
  if (name) updatedProduct.name = name;
  if (category) updatedProduct.category = category;
  if (tags) updatedProduct.tags = tags;
  if (gender) updatedProduct.gender = gender;
  if (price) updatedProduct.price = price;
  if (color) updatedProduct.color = color;
  if (quantity) updatedProduct.quantity = quantity;
  if (size) updatedProduct.size = size;
  if (details) updatedProduct.details = details;
  if (shipping) updatedProduct.shipping = shipping;
  if (returns) updatedProduct.returns = returns;
  if (description) updatedProduct.description = description;
  if (status) updatedProduct.status = status;

  // Handle image upload if images are provided
  // if (req.files && req.files.images && req.files.images.length > 0) {
  //   const imageUploadPromise = req.files.images.map(async (image) => {
  //     const result = await cloudinary.uploader.upload(image.tempFilePath, {
  //       use_filename: true,
  //       folder: "ecommerce-images",
  //     });
  //     fs.unlinkSync(image.tempFilePath);
  //     return result.secure_url;
  //   });
  //   const uploadedImages = await Promise.all(imageUploadPromise);
  //   updatedProduct.images = uploadedImages;
  // }

  const image =
    req.files && req.files.image ? req.files.image.tempFilePath : null;

  if (image) {
    const imageResult = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "ecommerce-products",
      }
    );

    updatedProduct.image = imageResult.secure_url;
    fs.unlinkSync(image);
  }

  try {
    const updated = await Products.findByIdAndUpdate(
      { _id: productId },
      updatedProduct,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Product update failed" });
  }
});

export const getByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const product = await Products.find({ category: category });

  if (product.length < 1) {
    res.status(400).json({ msg: "category not found" });
  }

  res.status(200).json({ success: true, product });
});

export const getByCategoryAndGender = asyncHandler(async (req, res) => {
  const { category, gender } = req.params;

  const product = await Products.find({ category: category, gender: gender });

  if (product.length < 1) {
    res.status(400).json({ msg: "product not found" });
  }

  res.status(200).json({ success: true, product });
});

export const getRecentProduct = asyncHandler(async (req, res) => {
  const { gender } = req.params;
  const RecentProduct = await Products.find({ gender: gender })
    .sort("-createdAt")
    .limit(15);

  res
    .status(200)
    .json({ numOdProduct: RecentProduct.length, success: true, RecentProduct });
});

export const getByCategoryAndTags = asyncHandler(async (req, res) => {
  const { category, tags } = req.params;

  const product = await Products.find({ category: category, tags: tags });

  // if (product.length < 1) {
  //   res.status(400).json({ msg: "product not found" });
  // }

  res.status(200).json({ success: true, product });
});
