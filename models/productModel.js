import pool from "../config/db";

const Product = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  },
};

export default Product;
