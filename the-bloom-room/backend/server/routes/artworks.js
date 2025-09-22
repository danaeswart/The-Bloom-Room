const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST /artworks
router.post("/", upload.array("images", 10), (req, res) => {
    console.log("Received POST request at /artworks");
  try {
    const { artworkName, description, medium, price } = req.body;
    
    // For now, use a dummy artistID since we removed auth
    const artistID = 1; // You can replace with real logged-in user later

    // Insert artwork
    const artworkQuery = `INSERT INTO artworks (artistID, artworkName, description, medium, price)
                          VALUES (?, ?, ?, ?, ?)`;
    db.query(
      artworkQuery,
      [artistID, artworkName, description, medium, price],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error while inserting artwork" });
        }

        const artworkID = result.insertId;

        // Insert images
        const images = req.files;
        if (!images || images.length === 0) return res.status(400).json({ error: "No images uploaded" });

        const imageQuery = `INSERT INTO artwork_images (artworkID, imagePath) VALUES ?`;
        const imageValues = images.map(file => [artworkID, file.filename]);

        db.query(imageQuery, [imageValues], (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Database error while inserting images" });
          }

          res.status(200).json({ message: "Artwork uploaded successfully" });
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
