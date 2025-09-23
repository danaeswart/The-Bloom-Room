const express = require("express");
const router = express.Router();
const db = require("../db/db"); // promise-based
const multer = require("multer");
const path = require("path");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /artworks
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { userId, description, medium, price } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "At least one image is required" });

    // Get the artist ID for this user
    const [artistRows] = await db.query(
      "SELECT Artist_ID FROM Artist WHERE User_ID = ?",
      [userId]
    );

    if (!artistRows.length) return res.status(404).json({ error: "Artist not found" });
    const artistId = artistRows[0].Artist_ID;

    // Insert artwork
    const [artworkResult] = await db.query(
      "INSERT INTO Artwork (Artist_ID, Description, Price, Medium) VALUES (?, ?, ?, ?)",
      [artistId, description, price, medium]
    );

    const artworkId = artworkResult.insertId;

    // Insert images
    for (let file of req.files) {
      await db.query(
        "INSERT INTO ArtworkImages (Artwork_ID, Image_URL) VALUES (?, ?)",
        [artworkId, file.filename]
      );
    }

    res.status(201).json({ message: "Artwork uploaded successfully" });
  } catch (err) {
    console.error("Error uploading artwork:", err);
    res.status(500).json({ error: "Server error while uploading artwork" });
  }
});

module.exports = router;
