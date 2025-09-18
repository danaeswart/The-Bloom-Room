-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS the_bloom_room;
USE the_bloom_room;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('artist', 'buyer', 'admin') NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    surname VARCHAR(100),
    status TINYINT(1) DEFAULT 0  -- 0 = not verified, 1 = verified
);
