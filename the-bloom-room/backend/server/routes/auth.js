const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, username, name, surname, role } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Email, username, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash password

    const query = `
      INSERT INTO users (email, password_hash, role, username, name, surname, status)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(query, [email, hashedPassword, role, username, name, surname], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error." });
      }
      res.json({ message: "Account created successfully!", userId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;


//login logic

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const query = "SELECT * FROM users WHERE email = ? AND role = ?";
    db.query(query, [email, role], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error." });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found." });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password." });
      }

      // Login successful
      res.json({
        message: "Login successful!",
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
          name: user.name,
          surname: user.surname,
          status: user.status
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


