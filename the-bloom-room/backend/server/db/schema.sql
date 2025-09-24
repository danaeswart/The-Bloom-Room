-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2025 at 12:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_bloom_room`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddReview` (IN `pArtworkID` INT, IN `pUserID` INT, IN `pComment` CHAR(50))   BEGIN
    INSERT INTO ArtworkReview (Artwork_ID, User_ID, Comment)
    VALUES (pArtworkID, pUserID, pComment);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ApproveUser` (IN `pUserID` INT)   BEGIN
    UPDATE Users SET Status='verified' WHERE User_ID = pUserID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateArtistAcc` (IN `pUserID` INT)   BEGIN
    INSERT INTO Artist (User_ID, Bio, Profile_url, Account_Attributes)
    VALUES (pUserID, 'New to Bloom Room', NULL, JSON_ARRAY('Bold', 'Colourful', 'Fun'));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateUser` (IN `pEmail` VARCHAR(100), IN `pPasswordHash` VARCHAR(255), IN `pRole` ENUM('artist','buyer','admin'), IN `pUsername` VARCHAR(100), IN `pName` VARCHAR(50), IN `pSurname` VARCHAR(50))   BEGIN
    INSERT INTO Users (Email, PasswordHash, Role, Username, Name, Surname)
    VALUES (pEmail, pPasswordHash, pRole, pUsername, pName, pSurname);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PlaceOrder` (IN `pArtworkID` INT, IN `pUserID` INT)   BEGIN
    INSERT INTO Orders (Artwork_ID, User_ID, Status)
    VALUES (pArtworkID, pUserID, 'Pending');
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Profile_url` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_ID`, `User_ID`, `Profile_url`) VALUES
(2, 8, 'https://example.com/profiles/admin1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `Approval_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Admin_ID` int(11) NOT NULL,
  `Status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `Approval_type` enum('artist','buyer') NOT NULL,
  `Created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approval`
--

INSERT INTO `approval` (`Approval_ID`, `User_ID`, `Admin_ID`, `Status`, `Approval_type`, `Created_at`) VALUES
(13, 1, 2, 'Approved', 'artist', '2025-09-25 09:00:00'),
(14, 2, 2, 'Pending', 'artist', '2025-09-25 09:30:00'),
(15, 4, 2, 'Approved', 'artist', '2025-09-26 10:00:00'),
(16, 5, 2, 'Declined', 'artist', '2025-09-26 10:30:00'),
(17, 6, 2, 'Approved', 'buyer', '2025-09-27 11:00:00'),
(18, 7, 2, 'Pending', 'buyer', '2025-09-27 11:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `artist`
--

CREATE TABLE `artist` (
  `Artist_ID` int(11) NOT NULL,
  `Bio` text DEFAULT 'New to Bloom Room',
  `User_ID` int(11) NOT NULL,
  `Profile_url` varchar(255) DEFAULT NULL,
  `Account_Attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Account_Attributes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artist`
--

INSERT INTO `artist` (`Artist_ID`, `Bio`, `User_ID`, `Profile_url`, `Account_Attributes`) VALUES
(1, 'New to Bloom Room', 13, NULL, '[\"Bold\", \"Colourful\", \"Fun\"]');

-- --------------------------------------------------------

--
-- Table structure for table `artwork`
--

CREATE TABLE `artwork` (
  `Artwork_ID` int(11) NOT NULL,
  `Artist_ID` int(11) NOT NULL,
  `Description` text NOT NULL,
  `Price` int(11) NOT NULL,
  `Status` enum('available','not_available') DEFAULT 'available',
  `Medium` text NOT NULL,
  `Created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork`
--

INSERT INTO `artwork` (`Artwork_ID`, `Artist_ID`, `Description`, `Price`, `Status`, `Medium`, `Created_at`) VALUES
(9, 1, 'Abstract painting with vibrant colors and bold strokes.', 2500, 'available', 'Oil on canvas', '2025-09-01 10:30:00'),
(10, 1, 'Minimalist line art drawing exploring emotion.', 800, 'available', 'Ink on paper', '2025-09-05 14:20:00'),
(11, 2, 'Digital surreal landscape with dreamlike visuals.', 1500, 'available', 'Digital Art', '2025-09-08 09:45:00'),
(12, 2, 'Clay sculpture of a modern figure in motion.', 3200, 'not_available', 'Sculpture', '2025-09-10 11:15:00'),
(13, 3, 'Metal sculpture inspired by abstract geometry.', 4000, 'available', 'Metal Sculpture', '2025-09-12 16:50:00'),
(14, 3, 'Mixed media collage blending photography and paint.', 1800, 'available', 'Mixed Media', '2025-09-15 12:00:00'),
(15, 4, 'Large-scale painting with soft pastel tones.', 2800, 'available', 'Acrylic on canvas', '2025-09-18 13:10:00'),
(16, 5, 'Minimalist black-and-white line art.', 950, 'available', 'Ink on paper', '2025-09-20 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `artworkimages`
--

CREATE TABLE `artworkimages` (
  `Image_ID` int(11) NOT NULL,
  `Artwork_ID` int(11) NOT NULL,
  `Image_URL` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artworkimages`
--

INSERT INTO `artworkimages` (`Image_ID`, `Artwork_ID`, `Image_URL`) VALUES
(22, 9, 'https://example.com/artworks/artwork9_img1.jpg'),
(23, 9, 'https://example.com/artworks/artwork9_img2.jpg'),
(24, 10, 'https://example.com/artworks/artwork10_img1.jpg'),
(25, 11, 'https://example.com/artworks/artwork11_img1.jpg'),
(26, 11, 'https://example.com/artworks/artwork11_img2.jpg'),
(27, 12, 'https://example.com/artworks/artwork12_img1.jpg'),
(28, 13, 'https://example.com/artworks/artwork13_img1.jpg'),
(29, 13, 'https://example.com/artworks/artwork13_img2.jpg'),
(30, 14, 'https://example.com/artworks/artwork14_img1.jpg'),
(31, 15, 'https://example.com/artworks/artwork15_img1.jpg'),
(32, 16, 'https://example.com/artworks/artwork16_img1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `artworkreview`
--

CREATE TABLE `artworkreview` (
  `Review_ID` int(11) NOT NULL,
  `Artwork_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Comment` char(50) NOT NULL,
  `Created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artworkreview`
--

INSERT INTO `artworkreview` (`Review_ID`, `Artwork_ID`, `User_ID`, `Comment`, `Created_at`) VALUES
(20, 9, 6, 'Absolutely stunning piece!', '2025-09-21 10:00:00'),
(21, 9, 7, 'Love the colors and balance.', '2025-09-22 11:30:00'),
(22, 10, 6, 'Simple yet powerful.', '2025-09-23 09:15:00'),
(23, 10, 7, 'Elegant minimalism.', '2025-09-23 12:00:00'),
(24, 11, 6, 'Unique style, very creative.', '2025-09-24 14:45:00'),
(25, 12, 7, 'The sculpture captures motion beautifully.', '2025-09-25 12:00:00'),
(26, 13, 6, 'Amazing craftsmanship!', '2025-09-26 15:20:00'),
(27, 14, 7, 'Love the blend of photography and paint.', '2025-09-27 16:10:00'),
(28, 15, 6, 'Soft pastels give such a calming vibe.', '2025-09-28 10:50:00'),
(29, 16, 7, 'Minimalist but very expressive.', '2025-09-29 13:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `buyer`
--

CREATE TABLE `buyer` (
  `Buyer_ID` int(11) NOT NULL,
  `Bio` text DEFAULT NULL,
  `User_ID` int(11) NOT NULL,
  `Profile_url` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buyer`
--

INSERT INTO `buyer` (`Buyer_ID`, `Bio`, `User_ID`, `Profile_url`) VALUES
(1, 'Art lover and collector focused on modern pieces.', 6, 'https://example.com/profiles/buyer1.jpg'),
(2, 'Passionate about contemporary art and emerging artists.', 7, 'https://example.com/profiles/buyer2.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Commission_ID` int(11) NOT NULL,
  `Artwork_ID` int(11) NOT NULL,
  `Buyer_ID` int(11) NOT NULL,
  `Status` enum('Pending','Approved','Declined','Completed') DEFAULT 'Pending',
  `RequestedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Commission_ID`, `Artwork_ID`, `Buyer_ID`, `Status`, `RequestedAt`) VALUES
(1, 9, 1, 'Pending', '2025-09-25 10:00:00'),
(2, 10, 2, 'Approved', '2025-09-26 11:30:00'),
(3, 11, 1, 'Completed', '2025-09-27 12:45:00'),
(4, 12, 2, 'Declined', '2025-09-28 13:15:00'),
(5, 13, 1, 'Approved', '2025-09-29 14:00:00'),
(6, 14, 2, 'Pending', '2025-09-30 15:20:00'),
(7, 15, 1, 'Completed', '2025-10-01 09:45:00'),
(8, 16, 2, 'Approved', '2025-10-02 11:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('artist','buyer','admin') NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Username` varchar(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `Status` enum('verified','unverified') DEFAULT 'unverified'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `Email`, `PasswordHash`, `Role`, `CreatedAt`, `Username`, `Name`, `Surname`, `Status`) VALUES
(1, 'artist@gmail.com', '$2b$10$BPwmrsKcP7oZUGjteYLXS.XMOaPR5Xw9HrrTSjl10R0YFYntxYNBe', 'artist', '2025-09-23 15:07:04', 'artisttest', 'artist', 'artist', 'unverified'),
(2, 'artist2@gmail.com', '$2b$10$a0p2P4.fPvyfaKyR5AHmq.r9vWjq6Qn1roLTh/Mwzg.xGsXis0OO6', 'artist', '2025-09-23 22:35:25', 'artist2', 'artist2', 'artist2', 'unverified'),
(4, 'artist1@example.com', '123', 'artist', '2025-09-24 09:49:45', 'artist_one', 'Liam', 'Smith', 'verified'),
(5, 'artist2@example.com', '123', 'artist', '2025-09-24 09:49:45', 'artist_two', 'Sophia', 'Brown', ''),
(6, 'buyer1@example.com', '123', 'buyer', '2025-09-24 09:49:45', 'buyer_one', 'Ethan', 'Johnson', 'verified'),
(7, 'buyer2@example.com', '123', 'buyer', '2025-09-24 09:49:45', 'buyer_two', 'Ava', 'Williams', 'verified'),
(8, 'admin1@example.com', '123', 'admin', '2025-09-24 09:49:45', 'admin_master', 'Olivia', 'Taylor', 'verified'),
(9, 'buyer@gmail.com', '$2b$10$Z4MNLy40QqRAb8PzjIsUS.d6ctsnIfRBt3tO.siXKpxj3JSoi.vYK', 'buyer', '2025-09-24 10:23:45', 'buyer', 'buyer', 'buyer', ''),
(10, 'danae@gmail.com', '$2b$10$tLntLIYx/QJuCZcmFOop6uGgXzD5oRpFbABq3zsuW9ASYgV.OItrG', 'artist', '2025-09-24 10:45:46', 'danie', 'danae', 'swart', ''),
(11, 'admin@gmail.com', '$2b$10$HptFU4yPG.dBC0hH8Qj.ou02nWoOysYWSEAJZ6PGQnOtq2aI6e.nu', 'admin', '2025-09-24 10:51:51', 'admin', 'admin test', 'admin', ''),
(12, 'danaeswart@gmail.com', '$2b$10$yIHfujq3.dQVoYPX3gx4X.dRjaAFhVBfTNssRvYzofUGDlzJn5FfC', 'artist', '2025-09-24 11:34:03', 'DanieCreated', 'Danae', 'Swart', ''),
(13, 'test@gmail', '$2b$10$jwTJKElNQWebxtivBPl1gO4rgLioYlnbMuCPsApo.j0dj7brmztyC', 'artist', '2025-09-24 12:12:23', 'testArtist', 'testArtist', 'artisttest', '');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_artist_signup` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.role = 'artist' THEN
        CALL CreateArtistAcc(NEW.user_id);
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`Approval_ID`),
  ADD KEY `User_ID` (`User_ID`),
  ADD KEY `Admin_ID` (`Admin_ID`);

--
-- Indexes for table `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`Artist_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `artwork`
--
ALTER TABLE `artwork`
  ADD PRIMARY KEY (`Artwork_ID`),
  ADD KEY `Artist_ID` (`Artist_ID`);

--
-- Indexes for table `artworkimages`
--
ALTER TABLE `artworkimages`
  ADD PRIMARY KEY (`Image_ID`),
  ADD KEY `Artwork_ID` (`Artwork_ID`);

--
-- Indexes for table `artworkreview`
--
ALTER TABLE `artworkreview`
  ADD PRIMARY KEY (`Review_ID`),
  ADD KEY `Artwork_ID` (`Artwork_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `buyer`
--
ALTER TABLE `buyer`
  ADD PRIMARY KEY (`Buyer_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Commission_ID`),
  ADD UNIQUE KEY `Artwork_ID` (`Artwork_ID`),
  ADD KEY `fk_orders_buyer` (`Buyer_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `approval`
--
ALTER TABLE `approval`
  MODIFY `Approval_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `artist`
--
ALTER TABLE `artist`
  MODIFY `Artist_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artwork`
--
ALTER TABLE `artwork`
  MODIFY `Artwork_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `artworkimages`
--
ALTER TABLE `artworkimages`
  MODIFY `Image_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `artworkreview`
--
ALTER TABLE `artworkreview`
  MODIFY `Review_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `buyer`
--
ALTER TABLE `buyer`
  MODIFY `Buyer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Commission_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `approval`
--
ALTER TABLE `approval`
  ADD CONSTRAINT `approval_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `approval_ibfk_2` FOREIGN KEY (`Admin_ID`) REFERENCES `admin` (`Admin_ID`) ON DELETE CASCADE;

--
-- Constraints for table `artist`
--
ALTER TABLE `artist`
  ADD CONSTRAINT `artist_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `artworkimages`
--
ALTER TABLE `artworkimages`
  ADD CONSTRAINT `artworkimages_ibfk_1` FOREIGN KEY (`Artwork_ID`) REFERENCES `artwork` (`Artwork_ID`) ON DELETE CASCADE;

--
-- Constraints for table `artworkreview`
--
ALTER TABLE `artworkreview`
  ADD CONSTRAINT `artworkreview_ibfk_1` FOREIGN KEY (`Artwork_ID`) REFERENCES `artwork` (`Artwork_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `artworkreview_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `buyer`
--
ALTER TABLE `buyer`
  ADD CONSTRAINT `buyer_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_buyer` FOREIGN KEY (`Buyer_ID`) REFERENCES `buyer` (`Buyer_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`Artwork_ID`) REFERENCES `artwork` (`Artwork_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
