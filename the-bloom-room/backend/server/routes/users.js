const express = require("express");
const db = require("../db/db"); // make sure this is your MySQL connection
const router = express.Router();

// GET /users/:id
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT User_ID, Username, Email, Name, Surname, Role FROM Users WHERE User_ID = ?";
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
    UPDATE Users
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


module.exports = router;
