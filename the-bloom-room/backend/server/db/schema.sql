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


CREATE DATABASE IF NOT EXISTS the_bloom_room;
USE the_bloom_room;

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    artworkID INT AUTO_INCREMENT PRIMARY KEY,
    artistID INT DEFAULT 1,   -- hardcoded for now
    artworkName VARCHAR(255) NOT NULL,
    description TEXT,
    medium VARCHAR(100),
    price DECIMAL(10,2),
    status TINYINT DEFAULT 0, -- 0 = available
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artwork images table
CREATE TABLE IF NOT EXISTS artwork_images (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    artworkID INT NOT NULL,
    imagePath VARCHAR(255) NOT NULL,
    FOREIGN KEY (artworkID) REFERENCES artworks(artworkID) ON DELETE CASCADE
);
