import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      minlength: [3, "Title must have at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      minLneghtL: [10, "Description mush have at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("products", productSchema);
export default productModel;
