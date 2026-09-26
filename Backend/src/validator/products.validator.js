import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

export const validateProductId = [
  param("id")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid product ID format"),
  handleValidationErrors,
];

export const createProductValidator = [
  body("title")
    .exists()
    .withMessage("Product title is required")
    .bail()
    .isString()
    .withMessage("Product title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Product title cannot be empty")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title length must be between 3 and 100 characters"),
  body("description")
    .exists()
    .withMessage("Product description is required")
    .bail()
    .isString()
    .withMessage("Product description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty")
    .bail()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("price")
    .exists()
    .withMessage("Product price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number")
    .bail()
    .toFloat(),
  body("stock")
    .exists()
    .withMessage("Stock is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer and at least 0")
    .bail()
    .toInt(),
  handleValidationErrors,
];

export const updateProductValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage("Product title must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title length must be between 3 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Product description must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .bail()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number")
    .bail()
    .toFloat(),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer and at least 0")
    .bail()
    .toInt(),

  handleValidationErrors,
];
