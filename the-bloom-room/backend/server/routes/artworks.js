const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db/db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // One folder up only
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST new artwork
router.post("/", upload.array("images", 10), (req, res) => {
  console.log("=== POST /artworks called ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const { Artwork_Name, description, medium, price, artistID } = req.body;

  if (!artistID) return res.status(400).json({ error: "Artist ID is required" });
  if (!Artwork_Name) return res.status(400).json({ error: "Artwork name is required" });
  if (!description) return res.status(400).json({ error: "Description is required" });

  const sql = `
    INSERT INTO artworks (Artwork_Name, Artist_ID, Description, Price, Status, Medium, Created_at)
    VALUES (?, ?, ?, ?, 'available', ?, NOW())
  `;

  db.query(sql, [Artwork_Name, artistID, description, price || 0, medium || ""], (err, result) => {
    if (err) {
      console.error("❌ Artwork insert error:", err);
      return res.status(500).json({ error: "Database error while inserting artwork", details: err });
    }

    const artworkID = result.insertId;
    console.log("Artwork inserted with ID:", artworkID);

    if (req.files && req.files.length > 0) {
      const imageSql = `INSERT INTO artworkimages (Artwork_ID, Image_URL) VALUES ?`;

      const values = req.files.map(file => [artworkID, "/uploads/" + file.filename]);

      db.query(imageSql, [values], (imgErr) => {
        if (imgErr) {
          console.error("❌ Error inserting artwork images:", imgErr);
          return res.status(500).json({ error: "Error inserting images", details: imgErr });
        }
        console.log("Artwork images inserted:", values);
        return res.json({ message: "Artwork and images uploaded successfully!" });
      });
    } else {
      return res.json({ message: "Artwork uploaded successfully (no images)." });
    }
  });
});


module.exports = router;
