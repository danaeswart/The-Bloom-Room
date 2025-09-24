const express = require("express");
const db = require("../db/db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

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

// // GET artist info by user ID
//------------ this works for artist info on profile page 
// router.get("/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const query =
//     "SELECT Bio, Profile_url, Account_Attributes FROM Artist WHERE User_ID = ?";

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching artist:", err);
//       return res.status(500).json({ message: "Server error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Artist not found" });
//     }
//     res.json(results[0]);
//   });
// });


//---- new code added to handle bloompost aswell
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const query =
    "SELECT Artist_ID, Bio, Profile_url, Account_Attributes FROM Artist WHERE User_ID = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching artist:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(results[0]); // now includes Artist_ID
  });
});


// UPDATE artist 
//------------------ this code wors for update profile but not for image upload ------------------//
// router.put("/:userId", upload.single("profile_url"), (req, res) => {
//   console.log("=== PUT /artist/:userId called ===");
//   console.log("Params:", req.params);
//   console.log("Body:", req.body);
//   console.log("File:", req.file);

//   const { userId } = req.params;
//   const { bio, account_attributes } = req.body;
//   const profile_url = req.file ? `/uploads/${req.file.filename}` : req.body.profile_url || null;

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


router.put("/:userId", upload.single("profile_url"), (req, res) => {
  console.log("=== PUT /artist/:userId called ===");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { userId } = req.params;
  const { bio, account_attributes } = req.body;

  let profile_url = null;

  if (req.file) {
    profile_url = `/uploads/${req.file.filename}`; // multer saves file path
  } else if (req.body.profile_url) {
    profile_url = req.body.profile_url; // allow existing URL
  }

  const query = `
    UPDATE Artist
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




module.exports = router;
