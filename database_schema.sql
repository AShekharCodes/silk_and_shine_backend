CREATE DATABASE silkandshine;

USE silkandshine;

-- This script drops existing tables to start fresh and avoid conflicts.
-- Be cautious running this in a production environment.
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `sellers`;
DROP TABLE IF EXISTS `users`;

-- User table to store core user information and handle multiple auth methods.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255), -- Nullable for OAuth users who don't set a password
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100),
  `profile_image_url` VARCHAR(255),
  `auth_provider` ENUM('local', 'google') NOT NULL DEFAULT 'local',
  `auth_provider_id` VARCHAR(255), -- To store Google's unique user ID
  `is_seller` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
);

-- Seller-specific information, linked one-to-one with a user.
CREATE TABLE `sellers` (
  `user_id` INT PRIMARY KEY,
  `shop_name` VARCHAR(255) NOT NULL UNIQUE,
  `shop_description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Defines product categories.
CREATE TABLE `product_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `parent_category_id` INT, -- For sub-categories
  FOREIGN KEY (`parent_category_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL
);

-- Core products table with soft delete and seller link.
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `category_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `sku` VARCHAR(100) UNIQUE, -- Stock Keeping Unit
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `is_visible` BOOLEAN NOT NULL DEFAULT TRUE, -- For soft deletes
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_products_seller_id` (`seller_id`),
  INDEX `idx_products_name` (`name`)
);

-- Allows for multiple images per product.
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Stores user addresses (shipping and billing).
CREATE TABLE `addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255),
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(50) NOT NULL,
  `address_type` ENUM('shipping', 'billing') NOT NULL,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Main orders table.
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `buyer_id` INT NOT NULL,
  `shipping_address_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT
);

-- Junction table for items within an order.
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price_per_unit` DECIMAL(10, 2) NOT NULL, -- Price at the time of purchase
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
);

-- Table for product reviews.
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_product_user_review` (`product_id`, `user_id`) -- A user can only review a product once
);


