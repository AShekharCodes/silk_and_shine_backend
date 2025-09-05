import db from "../config/db.js";

const Product = {
  findAll: async () => {
    const sql = "SELECT * FROM products";
    const [rows] = await db.query(sql);
    return rows;
  },

  findById: async (id) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows;
  },
};

export default Product;
