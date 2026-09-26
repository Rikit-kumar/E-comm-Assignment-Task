import productModel from "../model/products.model.js";

export const createProductsController = async (req, res) => {
  try {
    const { title, description, price, stock } = req.body;

    const product = await productModel.create({
      title,
      description,
      price,
      stock,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("create product controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: {
        products,
        totalCount: products.length,
      },
    });
  } catch (error) {
    console.log("all products controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSingleProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel
      .findById(id)
      .populate("user", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("get single products controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "At least one field is required to update the product",
      });
    }

    const updateProduct = await productModel.findOneAndUpdate(
      { _id: id, user: req.user.id || req.user._id },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updateProduct) {
      return res.status(404).json({
        message:
          "Product not found or you are not authorized to update this product",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: {
        product: updateProduct,
      },
    });
  } catch (error) {
    console.log("update product controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await productModel.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleteProduct) {
      return res.status(404).json({
        message:
          "Product not found or you are not authorized to delete this product",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("delete product controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
