import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileupload from "express-fileupload";
import { errorHandler } from "./middleware/errorHandler.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRoute.js";
import paystackRouter from "./routers/paystackRouter.js";
import reviewRouter from "./routers/reviewsRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(errorHandler);
app.use(express.json());
app.use(cors());

app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "Home Page" });
});

app.use("/api/v1/auth/", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payStack", paystackRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((req, res) => {
  res.status(404).json({ errMsg: "page not found" });
});

const server = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO, { dbName: "ecommerce-server" });
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
