import mongoose, { mongo, Schema } from "mongoose";
import validator from "validator";

const { isEmail } = validator;

const userSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      minLength: [7, "Please should be at least 7 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
