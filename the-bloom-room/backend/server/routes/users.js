import express from "express";
import db from "../db/db.js";      // note the .js at the end
import multer from "multer";
import path from "path";

const router = express.Router();

console.log("🚀 Users route file loaded");
// GET /users/:id
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT User_ID, Username, Email, Name, Surname, Role FROM users WHERE User_ID = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user: results[0] });
  });
});
// updates made on profile page -- 

router.put("/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, surname } = req.body;

  const query = `
    UPDATE users
    SET Name = ?, Surname = ?
    WHERE User_ID = ?
  `;

  db.query(query, [name, surname, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating user info" });
    }
    return res.json({ message: "User info updated successfully" });
  });
});


// export router for ES modules
export default router;

