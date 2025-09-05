import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import db from "../config/db.js";

// Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const userExists = await User.findByEmail(email, connection);
    if (userExists) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: passwordHash,
    };

    const userId = await User.create(newUser, connection);
    await connection.commit();

    res.status(201).json({
      id: userId,
      firstName,
      lastName,
      email,
      token: generateToken(userId),
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error in register controller:", error);
    res.status(500).json({
      message: "Server error during user registration.",
      error: error,
    });
  } finally {
    connection.release();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({
        message:
          "Invalid credentials or user signed up with a social provider.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      is_seller: user.is_seller,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res
      .status(500)
      .json({ message: "Server error during login.", error: error });
  }
};
