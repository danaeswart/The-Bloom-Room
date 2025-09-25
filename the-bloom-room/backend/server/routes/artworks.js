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


//-- normalisation to get artworks and images together --//

// GET all artworks with main image
router.get("/", (req, res) => {
  const sql = `
    SELECT a.Artwork_ID, a.Artwork_Name, a.Artist_ID, a.Description, a.Price, a.Status, a.Medium, a.Created_at,
           ai.Image_URL
    FROM Artworks a
    LEFT JOIN ArtworkImages ai ON a.Artwork_ID = ai.Artwork_ID
    GROUP BY a.Artwork_ID
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching artworks" });
    }
    res.json(results);
  });
});

// GET artworks by specific artist
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      a.Artwork_ID, 
      a.Artwork_Name, 
      a.Artist_ID, 
      u.Username AS Artist_Username, 
      a.Description, 
      a.Price, 
      a.Status, 
      a.Medium, 
      a.Created_at,
      ai.Image_ID, 
      ai.Image_URL
    FROM Artworks a
    LEFT JOIN ArtworkImages ai ON a.Artwork_ID = ai.Artwork_ID
    LEFT JOIN Artist ar ON a.Artist_ID = ar.Artist_ID
    LEFT JOIN Users u ON ar.User_ID = u.User_ID
    WHERE a.Artwork_ID = ?
  `;

  console.log("🔍 Running query for artwork ID:", id);

  db.query(sql, [id], (err, results) => {
    console.log("📜 SQL results:", results);

    if (err) {
      console.error("❌ Error fetching artwork:", err);
      return res.status(500).json({ message: "Error fetching artwork", error: err });
    }

    if (results.length === 0) {
      console.log("⚠️ No artwork found for ID:", id);
      return res.status(404).json({ message: "Artwork not found" });
    }

    const artwork = {
      Artwork_ID: results[0].Artwork_ID,
      Artwork_Name: results[0].Artwork_Name,
      Artist_ID: results[0].Artist_ID,
      Artist_Username: results[0].Artist_Username || "Unknown Artist",
      Description: results[0].Description,
      Price: results[0].Price,
      Status: results[0].Status,
      Medium: results[0].Medium,
      Created_at: results[0].Created_at,
      Images: results
        .map(r => ({ Image_ID: r.Image_ID, Image_URL: r.Image_URL }))
        .filter(img => img.Image_ID)
    };

    console.log("🎯 Final artwork object:", artwork);

    res.json(artwork);
  });
});

module.exports = router;
