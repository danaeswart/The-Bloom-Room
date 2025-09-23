const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db/db");

const router = express.Router();

// 📂 Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // save to backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🎨 POST /artworks → create new artwork
router.post("/", upload.array("images", 10), (req, res) => {
  const { artworkName, description, medium, price } = req.body;
  const artistID = 1; // hardcoded for now

  if (!artworkName || !description) {
    return res.status(400).json({ error: "Artwork name and description are required" });
  }

  const sql = `
    INSERT INTO artworks (artistID, artworkName, description, medium, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [artistID, artworkName, description, medium, price], (err, result) => {
    if (err) {
      console.error("❌ Database error while inserting artwork:", err);
      return res.status(500).json({ error: "Database error while inserting artwork" });
    }

    const artworkID = result.insertId;

    // Handle images if uploaded
    if (req.files && req.files.length > 0) {
      const imageSql = `INSERT INTO artwork_images (artworkID, imagePath) VALUES ?`;
      const values = req.files.map(file => [artworkID, "/uploads/" + file.filename]);

      db.query(imageSql, [values], (imgErr) => {
        if (imgErr) {
          console.error("❌ Error inserting images:", imgErr);
          return res.status(500).json({ error: "Error inserting images" });
        }
        res.json({ message: "✅ Artwork and images uploaded successfully!" });
      });
    } else {
      res.json({ message: "✅ Artwork uploaded successfully (no images)." });
    }
  });
});

// 🎨 GET /artworks/test → quick test
router.get("/test", (req, res) => {
  res.json({ message: "🎨 Artworks API is working!" });
});

module.exports = router;
