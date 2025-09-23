-- ========================================
-- Bloom Room Database Schema
-- ========================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS ArtworkReview;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Artwork;
DROP TABLE IF EXISTS Approval;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Buyer;
DROP TABLE IF EXISTS Artist;
DROP TABLE IF EXISTS Users;

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE Users (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('artist','buyer','admin') NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Name VARCHAR(50) NOT NULL,
    Surname VARCHAR(50) NOT NULL,
    Status ENUM('verified','unverified') DEFAULT 'unverified'
);

-- ========================================
-- Artist Table (One-to-One with Users)
-- ========================================
CREATE TABLE Artist (
    Artist_ID INT AUTO_INCREMENT PRIMARY KEY,
    Bio TEXT NULL,
    User_ID INT UNIQUE NOT NULL,
    Profile_url CHAR(50) NULL,
    Account_Attributes CHAR(50) NULL,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ========================================
-- Buyer Table (One-to-One with Users)
-- ========================================
CREATE TABLE Buyer (
    Buyer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Bio TEXT NULL,
    User_ID INT UNIQUE NOT NULL,
    Profile_url CHAR(50) NULL,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ========================================
-- Admin Table (One-to-One with Users)
-- ========================================
CREATE TABLE Admin (
    Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT UNIQUE NOT NULL,
    Profile_url VARCHAR(50) NULL,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ========================================
-- Artwork Table (One-to-Many Artist -> Artwork)
-- ========================================
CREATE TABLE Artwork (
    Artwork_ID INT AUTO_INCREMENT PRIMARY KEY,
    Artist_ID INT NOT NULL,
    Description TEXT NOT NULL,
    Price INT NOT NULL,
    Status ENUM('available','not_available') DEFAULT 'available',
    Medium TEXT NOT NULL,
    Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Artist_ID) REFERENCES Artist(Artist_ID) ON DELETE CASCADE
);

-- ========================================
-- Artwork Review Table (One-to-Many Artwork -> Review)
-- ========================================
CREATE TABLE ArtworkReview (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    Artwork_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Comment CHAR(50) NOT NULL,
    Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Artwork_ID) REFERENCES Artwork(Artwork_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ========================================
-- Orders Table (One-to-Many Buyer -> Orders, One-to-One Artwork -> Order)
-- ========================================
CREATE TABLE Orders (
    Commission_ID INT AUTO_INCREMENT PRIMARY KEY,
    Artwork_ID INT UNIQUE NOT NULL,
    User_ID INT NOT NULL,
    Status ENUM('Pending','Approved','Declined','Completed') DEFAULT 'Pending',
    RequestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Artwork_ID) REFERENCES Artwork(Artwork_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

-- ========================================
-- Approval Table (One-to-Many Admin -> Approval)
-- ========================================
CREATE TABLE Approval (
    Approval_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Admin_ID INT NOT NULL,
    Status ENUM('Pending','Approved','Declined') DEFAULT 'Pending',
    Approval_type ENUM('artist','buyer') NOT NULL,
    Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE
);

-- ========================================
-- Example Stored Procedures / Functions
-- ========================================

-- 1. Create a new user
DELIMITER $$
CREATE PROCEDURE CreateUser(
    IN pEmail VARCHAR(100),
    IN pPasswordHash VARCHAR(255),
    IN pRole ENUM('artist','buyer','admin'),
    IN pUsername VARCHAR(100),
    IN pName VARCHAR(50),
    IN pSurname VARCHAR(50)
)
BEGIN
    INSERT INTO Users (Email, PasswordHash, Role, Username, Name, Surname)
    VALUES (pEmail, pPasswordHash, pRole, pUsername, pName, pSurname);
END $$
DELIMITER ;

-- 2. Approve user (artist/buyer)
DELIMITER $$
CREATE PROCEDURE ApproveUser(IN pUserID INT)
BEGIN
    UPDATE Users SET Status='verified' WHERE User_ID = pUserID;
END $$
DELIMITER ;

-- 3. Place an order
DELIMITER $$
CREATE PROCEDURE PlaceOrder(IN pArtworkID INT, IN pUserID INT)
BEGIN
    INSERT INTO Orders (Artwork_ID, User_ID, Status)
    VALUES (pArtworkID, pUserID, 'Pending');
END $$
DELIMITER ;

-- 4. Add a review
DELIMITER $$
CREATE PROCEDURE AddReview(IN pArtworkID INT, IN pUserID INT, IN pComment CHAR(50))
BEGIN
    INSERT INTO ArtworkReview (Artwork_ID, User_ID, Comment)
    VALUES (pArtworkID, pUserID, pComment);
END $$
DELIMITER ;
