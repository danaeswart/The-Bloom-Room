import express from "express";
import db from "../db/db.js";      // note the .js at the end
import multer from "multer";
import path from "path";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import upload from "../upload.js"; // multer-cloudinary middleware
import cloudinary from "../cloudinary.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.memoryStorage(); // keep files in memory temporarily

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "artist_profiles", allowed_formats: ["jpg","jpeg","png"] },
});

const profileUpload = multer({ storage: profileStorage });
const router = express.Router();
// === Multer Setup for Uploads === //
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });


// === GET artworks for a specific user/artist === //
router.get("/user/:artistId", (req, res) => {
  const { artistId } = req.params;
  console.log("🎨 Route /user/:artistId triggered with:", artistId);
  console.log("🎨 [GET /user/:artistId] Route hit!");
  console.log("➡️ Received artistId:", artistId);

  const sql = `
   SELECT a.Artwork_ID, a.Artwork_Name, a.Artist_ID, a.Description, a.Price, a.Status, a.Medium, a.Created_at,
       ai.Image_URL
FROM artwork a
LEFT JOIN artworkimages ai
  ON ai.Image_ID = (
      SELECT MIN(Image_ID)
      FROM artworkimages
      WHERE Artwork_ID = a.Artwork_ID
  )
WHERE a.Artist_ID = ?

`;
  console.log("🧠 Running SQL query to fetch artworks for Artist_ID:", artistId);

  db.query(sql, [artistId], (err, results) => {
    console.log("📡 SQL query executed.");

    if (err) {
      console.error("❌ SQL ERROR while fetching artist artworks:", err);
      return res.status(500).json({ error: "Server error", details: err.message });
    }

    console.log("✅ SQL query successful. Number of artworks found:", results.length);

    if (results.length === 0) {
      console.warn("⚠️ No artworks found for artist with ID:", artistId);
      return res.status(404).json({ message: "No artworks found for this artist" });
    }

    console.log("🎉 Sending artworks data back to client...");
    res.json(results);
  });
});

// === GET specific artwork by ID (with artist and images) === //
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
    FROM artwork a
    LEFT JOIN artworkimages ai ON a.Artwork_ID = ai.Artwork_ID
    LEFT JOIN artist ar ON a.Artist_ID = ar.Artist_ID
    LEFT JOIN users u ON ar.User_ID = u.User_ID
    WHERE a.Artwork_ID = ?
  `;

  console.log("🔍 Fetching artwork with ID:", id);

  db.query(sql, [id], (err, results) => {
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





//get artist by userID

router.get("/:userID", (req, res) => {
  const { userID } = req.params;

  const sql = `
    SELECT Artist_ID
    FROM artist
    WHERE User_ID = ?
  `;

  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error("❌ Error fetching artist by userID:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Artist not found for this user" });
    }

    res.json(results[0]); // { Artist_ID: ... }
  });
});




// === POST new artwork === //
// router.post("/", upload.array("images", 10), (req, res) => {
//   console.log("=== POST /artworks called ===");
//   console.log("req.body:", req.body);
//   console.log("req.files:", req.files);

//   const { Artwork_Name, description, medium, price, artistID } = req.body;

//   if (!artistID) return res.status(400).json({ error: "Artist ID is required" });
//   if (!Artwork_Name) return res.status(400).json({ error: "Artwork name is required" });
//   if (!description) return res.status(400).json({ error: "Description is required" });

//   const sql = `
//     INSERT INTO artwork (Artwork_Name, Artist_ID, Description, Price, Status, Medium, Created_at)
//     VALUES (?, ?, ?, ?, 'available', ?, NOW())
//   `;

//   db.query(sql, [Artwork_Name, artistID, description, price || 0, medium || ""], (err, result) => {
//     if (err) {
//       console.error("❌ Artwork insert error:", err);
//       return res.status(500).json({ error: "Database error while inserting artwork", details: err });
//     }

//     const artworkID = result.insertId;
//     console.log("✅ Artwork inserted with ID:", artworkID);

//     if (req.files && req.files.length > 0) {
//       const imageSql = `INSERT INTO artworkimages (Artwork_ID, Image_URL) VALUES ?`;
//       const values = req.files.map(file => [artworkID, "/uploads/" + file.filename]);

//       db.query(imageSql, [values], (imgErr) => {
//         if (imgErr) {
//           console.error("❌ Error inserting artwork images:", imgErr);
//           return res.status(500).json({ error: "Error inserting images", details: imgErr });
//         }
//         console.log("✅ Artwork images inserted:", values);
//         return res.json({ message: "Artwork and images uploaded successfully!" });
//       });
//     } else {
//       return res.json({ message: "Artwork uploaded successfully (no images)." });
//     }
//   });
// });

//--------------og post with local

router.post("/", upload.array("images", 10), (req, res) => {
  const { Artwork_Name, description, medium, price, artistID, status } = req.body; // <-- Added `status` here

  if (!artistID || !Artwork_Name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ==========================
  // Determine artwork status
  // ==========================
  // Default to 'available' if not specified
  const artworkStatus = status === "not_available" ? "not_available" : "available"; // <-- Added this

  // Step 1: Insert artwork
  const sql = `
    INSERT INTO artwork (Artwork_Name, Artist_ID, Description, Price, Status, Medium, Created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())  -- <-- added artworkStatus here
  `;

  db.query(sql, [Artwork_Name, artistID, description, price || 0, artworkStatus, medium || ""], (err, result) => {
    if (err) {
      console.error("❌ Artwork insert error:", err);
      return res.status(500).json({ error: "Database error while inserting artwork" });
    }

    const artworkID = result.insertId;

    // Step 2: Upload images to Cloudinary
    if (!req.files || req.files.length === 0) {
      return res.json({ message: "Artwork uploaded successfully (no images).", artworkID });
    }

    const uploadedImages = [];
    let uploadedCount = 0;

    req.files.forEach(file => {
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (err, result) => {
        if (err) {
          console.error("❌ Cloudinary upload error:", err);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        uploadedImages.push(result.secure_url);
        uploadedCount++;

        if (uploadedCount === req.files.length) {
          // Step 3: Insert image URLs into artworkimages table
          const imageSql = "INSERT INTO artworkimages (Artwork_ID, Image_URL) VALUES ?";
          const values = uploadedImages.map(url => [artworkID, url]);

          db.query(imageSql, [values], (imgErr) => {
            if (imgErr) {
              console.error("❌ Error inserting artwork images:", imgErr);
              return res.status(500).json({ error: "Error inserting images into DB" });
            }

            res.json({ message: "Artwork and images uploaded successfully!", artworkID });
          });
        }
      }).end(file.buffer); // important: send file buffer to Cloudinary
    });
  });
});



// GET single artwork by Artwork_ID
router.get("/:artworkId", (req, res) => {
  console.log("🚀 [GET /:artworkId] Route hit!");
  const { artworkId } = req.params;
  const sql = `
    SELECT a.*, ai.Image_URL, u.Username AS Artist_Username
    FROM artwork a
    LEFT JOIN artworkimages ai ON a.Artwork_ID = ai.Artwork_ID
    LEFT JOIN artist ar ON a.Artist_ID = ar.Artist_ID
    LEFT JOIN users u ON ar.User_ID = u.User_ID
    WHERE a.Artwork_ID = ?
  `;

  db.query(sql, [artworkId], (err, results) => {
    if (err) {
      console.error("Error fetching artwork:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    // Transform results to group images
    const artwork = {
      Artwork_ID: results[0].Artwork_ID,
      Artwork_Name: results[0].Artwork_Name,
      Artist_ID: results[0].Artist_ID,
      Artist_Username: results[0].Artist_Username,
      Description: results[0].Description,
      Medium: results[0].Medium,
      Price: results[0].Price,
      Status: results[0].Status,
      Images: results.map(row => ({ Image_URL: row.Image_URL }))
    };

    res.json(artwork);
  });
});







// === GET all artworks (with one image each) === //
router.get("/", (req, res) => {
  const sql = `
    SELECT a.Artwork_ID, a.Artwork_Name, a.Artist_ID, a.Description, a.Price, a.Status, a.Medium, a.Created_at,
           ai.Image_URL
    FROM artwork a
    LEFT JOIN artworkimages ai ON a.Artwork_ID = ai.Artwork_ID
   WHERE ai.Image_ID = (
    SELECT MIN(Image_ID) 
    FROM artworkimages 
    WHERE Artwork_ID = a.Artwork_ID
)
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching artworks" });
    }
    res.json(results);
  });
});


// Example using MySQL
// GET /artwork
router.get("/artwork", async (req, res) => {
  try {
    const query = `
     SELECT 
        a.Artwork_ID, 
        a.Artwork_Name, 
        a.Description, 
        a.Price, 
        a.Status, 
        a.Medium, 
        a.Created_at,
        ai.Image_URL
      FROM artwork a
      LEFT JOIN artworkimages ai
      ON a.Artwork_ID = ai.Artwork_ID
    `;

    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching artworks:", err);
    res.status(500).json({ message: "Server error" });
  }
});





// === UPDATE Artwork details === //
router.put("/:artworkId", (req, res) => {
  const { artworkId } = req.params;
  const { Artwork_Name, Description, Medium, Price } = req.body;

  console.log("📝 Updating artwork:", artworkId);
  console.log("➡️ Data received:", req.body);

  const sql = `
    UPDATE artwork
    SET Artwork_Name = ?, Description = ?, Medium = ?, Price = ?
    WHERE Artwork_ID = ?
  `;

  db.query(sql, [Artwork_Name, Description, Medium, Price, artworkId], (err, result) => {
    if (err) {
      console.error("❌ Error updating artwork:", err);
      return res.status(500).json({ message: "Database error updating artwork", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    console.log("✅ Artwork updated successfully:", result);
    res.json({ message: "Artwork updated successfully" });
  });
});

// === DELETE an artwork, its images, and any related orders === //
router.delete("/:artworkId", (req, res) => {
  const { artworkId } = req.params;

  console.log("🗑️ Deleting artwork with ID:", artworkId);

  // Step 1 — Delete any orders linked to this artwork
  const deleteOrdersSql = "DELETE FROM orders WHERE Artwork_ID = ?";
  db.query(deleteOrdersSql, [artworkId], (orderErr, orderResult) => {
    if (orderErr) {
      console.error("❌ Error deleting orders for artwork:", orderErr);
      return res
        .status(500)
        .json({ error: "Error deleting related orders", details: orderErr });
    }

    console.log(`📦 Deleted ${orderResult.affectedRows} order(s) for artwork ${artworkId}`);

    // Step 2 — Delete all artwork images linked to this artwork
    const deleteImagesSql = "DELETE FROM artworkimages WHERE Artwork_ID = ?";
    db.query(deleteImagesSql, [artworkId], (imgErr, imgResult) => {
      if (imgErr) {
        console.error("❌ Error deleting images for artwork:", imgErr);
        return res
          .status(500)
          .json({ error: "Error deleting artwork images", details: imgErr });
      }

      console.log(`🖼️ Deleted ${imgResult.affectedRows} image(s) for artwork ${artworkId}`);

      // Step 3 — Delete the artwork itself
      const deleteArtworkSql = "DELETE FROM artwork WHERE Artwork_ID = ?";
      db.query(deleteArtworkSql, [artworkId], (artErr, artResult) => {
        if (artErr) {
          console.error("❌ Error deleting artwork:", artErr);
          return res
            .status(500)
            .json({ error: "Error deleting artwork", details: artErr });
        }

        if (artResult.affectedRows === 0) {
          console.warn("⚠️ No artwork found with ID:", artworkId);
          return res.status(404).json({ message: "Artwork not found" });
        }

        console.log("✅ Artwork, related images, and orders deleted successfully!");
        res.json({ message: "Artwork, related images, and orders deleted successfully!" });
      });
    });
  });
});

// for buyer page to get their orders and then the artwork info fo theri profile
// POST /artworks/bulk
// Body: { artworkIds: [1,2,3] }
router.post("/bulk", (req, res) => {
  const { artworkIds } = req.body;

  if (!artworkIds || artworkIds.length === 0) {
    return res.status(400).json({ error: "No artwork IDs provided" });
  }

  const placeholders = artworkIds.map(() => "?").join(", ");

  const sql = `
    SELECT a.Artwork_ID, a.Artwork_Name, a.Artist_ID, a.Description, a.Price, a.Status, a.Medium, a.Created_at,
           ai.Image_ID, ai.Image_URL, u.Username AS Artist_Username
    FROM artwork a
    LEFT JOIN artworkimages ai ON a.Artwork_ID = ai.Artwork_ID
    LEFT JOIN artist ar ON a.Artist_ID = ar.Artist_ID
    LEFT JOIN users u ON ar.User_ID = u.User_ID
    WHERE a.Artwork_ID IN (${placeholders})
  `;

  db.query(sql, artworkIds, (err, results) => {
    if (err) {
      console.error("❌ Error fetching bulk artworks:", err);
      return res.status(500).json({ error: "Database error fetching artworks", details: err });
    }

    // Group images by Artwork_ID
    const artworksMap = {};
    results.forEach((row) => {
      if (!artworksMap[row.Artwork_ID]) {
        artworksMap[row.Artwork_ID] = {
          Artwork_ID: row.Artwork_ID,
          Artwork_Name: row.Artwork_Name,
          Artist_ID: row.Artist_ID,
          Artist_Username: row.Artist_Username,
          Description: row.Description,
          Price: row.Price,
          Status: row.Status,
          Medium: row.Medium,
          Created_at: row.Created_at,
          Images: [],
        };
      }
      if (row.Image_URL) {
        artworksMap[row.Artwork_ID].Images.push({ Image_ID: row.Image_ID, Image_URL: row.Image_URL });
      }
    });

    const artworksArray = Object.values(artworksMap);
    res.json(artworksArray);
  });
});

// artist.js

router.post("/upload-profile/:artistId", profileUpload.single("file"), async (req, res) => {
   console.log("🚀 /upload-profile route hit");  // add this
  try {
    const { artistId } = req.params;
     console.log("Received artistId:", artistId);  // log
    console.log("Received file:", req.file);      // log
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const profileUrl = req.file.path; // already Cloudinary URL

    await db.query("UPDATE artist SET Profile_url = ? WHERE Artist_ID = ?", [profileUrl, artistId]);

    res.json({ profileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload profile image" });
  }
});


// export router for ES modules
export default router;
