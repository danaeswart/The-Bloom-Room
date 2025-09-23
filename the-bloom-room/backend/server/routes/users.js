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


module.exports = router;
