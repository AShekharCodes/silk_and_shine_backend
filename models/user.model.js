import db from "../config/db.js";

const User = {
  create: async (newUser, connection) => {
    const sql =
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)";
    const [result] = await (connection || db).query(sql, [
      newUser.first_name,
      newUser.lastName,
      newUser.email,
      newUser.password_hash,
    ]);
    return result.insertId;
  },

  findByEmail: async (email, connection) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await (connection || db).query(sql, [email]);
    return rows[0];
  },

  findById: async (id, connection) => {
    const sql =
      "SELECT id, email, first_name, last_name, is_seller, profile_image_url FROM users WHERE id = ?";
    const [rows] = await (connection || db).query(sql, [id]);
    return rows[0];
  },
};

export default User;
