import express from "express";
import {
  createProduct,
  getAllVisibleProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isSellerMiddleware } from "../middlewares/seller.middleware.js";

const router = express.Router();

// @route   GET api/product
// @desc    Get all visible products
// @access  Public
router.get("/", getAllVisibleProducts);

// @route   GET api/product/:id
// @desc    Get a single product by ID
// @access  Public
router.get("/:id", getProductById);

// The routes below are protected and require the user to be a seller.

// @route   POST api/product/create
// @desc    Create a new product
// @access  Private (Seller only)
router.post("/create", authMiddleware, isSellerMiddleware, createProduct);

// @route   PUT api/product/update/:id
// @desc    Update a product
// @access  Private (Seller only)
router.put("/update/:id", authMiddleware, isSellerMiddleware, updateProduct);

// @route   DELETE api/product/delete/:id
// @desc    Soft delete a product (set is_visible to false)
// @access  Private (Seller only)
router.delete(
  "/delete/:id",
  authMiddleware,
  isSellerMiddleware,
  softDeleteProduct
);

export default router;
