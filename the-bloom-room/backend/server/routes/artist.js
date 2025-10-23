// const express = require("express");
// const db = require("../db/db");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });



// //---- new code added to handle bloompost aswell
// router.get("/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const query =
//     "SELECT Artist_ID, Bio, Profile_url, Account_Attributes FROM Artist WHERE User_ID = ?";

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching artist:", err);
//       return res.status(500).json({ message: "Server error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Artist not found" });
//     }
//     res.json(results[0]); // now includes Artist_ID
//   });
// });





// // ------------------ code for individual artist page -
// //-------------------when someone clicks on their username 
// router.get("/:artistId", (req, res) => {
//   const artistId = req.params.artistId;

//   const query = `
//     SELECT 
//       ar.Artist_ID, 
//       ar.Bio, 
//       ar.Profile_url, 
//       ar.Account_Attributes,
//       u.User_ID,
//       u.Username,
//       u.Name,
//       u.Surname,
//       u.Email
//     FROM Artist ar
//     LEFT JOIN Users u ON ar.User_ID = u.User_ID
//     WHERE ar.Artist_ID = ?
//   `;

//   db.query(query, [artistId], (err, results) => {
//     if (err) {
//       console.error("Error fetching artist profile:", err);
//       return res.status(500).json({ message: "Server error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Artist not found" });
//     }
//     res.json(results[0]); // sends artist + user info
//   });
// });


// router.put("/:userId", upload.single("profile_url"), (req, res) => {
//   console.log("=== PUT /artist/:userId called ===");
//   console.log("Params:", req.params);
//   console.log("Body:", req.body);
//   console.log("File:", req.file);

//   const { userId } = req.params;
//   const { bio, account_attributes } = req.body;

//   let profile_url = null;

//   if (req.file) {
//     profile_url = `/uploads/${req.file.filename}`; // multer saves file path
//   } else if (req.body.profile_url) {
//     profile_url = req.body.profile_url; // allow existing URL
//   }

//   const query = `
//     UPDATE Artist
//     SET Bio = ?, Profile_url = ?, Account_Attributes = ?
//     WHERE User_ID = ?
//   `;

//   db.query(query, [bio, profile_url, JSON.stringify(account_attributes), userId], (err, result) => {
//     if (err) {
//       console.error("Error updating artist profile:", err);
//       return res.status(500).json({ message: "Error updating artist profile" });
//     }
//     console.log("Artist profile updated:", result);
//     return res.json({ message: "Artist profile updated successfully" });
//   });
// });




// module.exports = router;




//-----------new

import express from "express";
import db from "../db/db.js";      // note the .js at the end
import multer from "multer";
import path from "path";

const router = express.Router();

console.log("🚀 Artist route file loaded");

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// === GET artist info by User_ID ===

// Get artist by User_ID
router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM artist WHERE User_ID = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching artist by user ID:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(result[0]);
  });
});


// // === Get artist by User_ID ===
// router.get("/:userId", (req, res) => {
//   const userId = req.params.userId;

//   const sql = "SELECT Artist_ID FROM artist WHERE User_ID = ?";
//   db.query(sql, [userId], (err, result) => {
//     if (err) {
//       console.error("❌ Error fetching artist by user ID:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ error: "Artist not found for this user" });
//     }

//     // Return only the Artist_ID
//     res.json(result[0]);
//   });
// });

// === GET artist profile by Artist_ID (for Profile Page) ===


// Get artworks by Artist_ID
router.get("/user/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  const sql = "SELECT * FROM artwork WHERE Artist_ID = ?";

  db.query(sql, [artistId], (err, result) => {
    if (err) {
      console.error("Error fetching artworks for artist:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No artworks found for this artist" });
    }

    res.json(result);
  });
});


router.get("/:artistId", (req, res) => {
  const artistId = req.params.artistId;

  const query = `
    SELECT 
      ar.Artist_ID, 
      ar.Bio, 
      ar.Profile_url, 
      ar.Account_Attributes,
      u.User_ID,
      u.Username,
      u.Name,
      u.Surname,
      u.Email
    FROM artist ar
    LEFT JOIN users u ON ar.User_ID = u.User_ID
    WHERE ar.Artist_ID = ?
  `;

  db.query(query, [artistId], (err, results) => {
    if (err) {
      console.error("Error fetching artist profile:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(results[0]);
  });
});

// === UPDATE artist profile ===
router.put("/:userId", upload.single("profile_url"), (req, res) => {
  console.log("=== PUT /artist/:userId called ===");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { userId } = req.params;
  const { bio, account_attributes } = req.body;

  let profile_url = null;

  if (req.file) {
    profile_url = `/uploads/${req.file.filename}`;
  } else if (req.body.profile_url) {
    profile_url = req.body.profile_url;
  }

  const query = `
    UPDATE artist
    SET Bio = ?, Profile_url = ?, Account_Attributes = ?
    WHERE User_ID = ?
  `;

  db.query(query, [bio, profile_url, JSON.stringify(account_attributes), userId], (err, result) => {
    if (err) {
      console.error("Error updating artist profile:", err);
      return res.status(500).json({ message: "Error updating artist profile" });
    }
    console.log("Artist profile updated:", result);
    return res.json({ message: "Artist profile updated successfully" });
  });
});


// export router for ES modules
export default router;
