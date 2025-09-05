import db from "../config/db.js";

const Product = {
  create: async (newProduct) => {
    const sql =
      "INSERT INTO products (seller_id, name, description, price, category_id, stock_quantity, sku) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      newProduct.seller_id,
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.category_id,
      newProduct.stock_quantity,
      newProduct.sku,
    ]);
    return result.insertId;
  },

  findAllVisible: async () => {
    // Later, you can add joins here to include seller info or images
    const sql = "SELECT * FROM products WHERE is_visible = TRUE";
    const [rows] = await db.query(sql);
    return rows;
  },

  findById: async (id) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  update: async (id, productData) => {
    // Dynamically build the update query based on provided data
    const fields = Object.keys(productData);
    const values = Object.values(productData);
    const fieldPlaceholders = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `UPDATE products SET ${fieldPlaceholders} WHERE id = ?`;
    const [result] = await db.query(sql, [...values, id]);
    return result;
  },

  updateVisibility: async (id, is_visible) => {
    const sql = "UPDATE products SET is_visible = ? WHERE id = ?";
    const [result] = await pool.query(sql, [is_visible, id]);
    return result;
  },
};

export default Product;
