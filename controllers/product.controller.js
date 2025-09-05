import Product from "../models/product.model.js";

export const getAllVisibleProducts = async (req, res) => {
  try {
    const products = await Product.findAllVisible();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllVisibleProducts controller:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.is_visible) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found or is unavailable." });
    }
  } catch (error) {
    console.error("Error in getProductById controller:", error);
    res.status(500).json({ message: "Server error while fetching product." });
  }
};

export const createProduct = async (req, res) => {
  // req.user is attached by the authMiddleware
  const seller_id = req.user.id;
  const { name, description, price, category_id, stock_quantity, sku } =
    req.body;

  try {
    const newProduct = {
      seller_id,
      name,
      description,
      price,
      category_id,
      stock_quantity,
      sku,
    };
    const productId = await Product.create(newProduct);
    const createdProduct = await Product.findById(productId);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error in createProduct controller:", error);
    res.status(500).json({ message: "Server error while creating product." });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const seller_id = req.user.id; // from authMiddleware

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Verify that the user updating the product is the one who created it
    if (product.seller_id !== seller_id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this product." });
    }

    await Product.update(id, req.body);
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct controller:", error);
    res.status(500).json({ message: "Server error while updating product." });
  }
};

export const softDeleteProduct = async (req, res) => {
  const { id } = req.params;
  const seller_id = req.user.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.seller_id !== seller_id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this product." });
    }

    await Product.updateVisibility(id, false);
    res.status(200).json({ message: "Product has been deactivated." });
  } catch (error) {
    console.error("Error in softDeleteProduct controller:", error);
    res
      .status(500)
      .json({ message: "Server error while deactivating product." });
  }
};
