import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts controller:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching products.", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById controller:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching product.", error });
  }
};
