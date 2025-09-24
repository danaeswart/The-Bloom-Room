const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db");

const router = express.Router();

// SIGNUP route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username, name, surname, role } = req.body;

    if (!email || !password || !username || !name || !surname || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const checkQuery = "SELECT * FROM Users WHERE Email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertQuery = `
        INSERT INTO Users (Email, Password, Username, Name, Surname, Role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [email, hashedPassword, username, name, surname, role],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Error creating user" });
          }
          res.status(201).json({ message: "User created successfully", userId: result.insertId });
        }
      );
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN route
// auth.js
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const query = "SELECT * FROM Users WHERE Email = ? AND Role = ?";
  db.query(query, [email, role], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials or role" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.PasswordHash || user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        User_ID: user.User_ID,
        Email: user.Email,
        Username: user.Username,
        Name: user.Name,
        Surname: user.Surname,
        Role: user.Role,
        Status: user.Status,
        CreatedAt: user.CreatedAt,
      },
    });
  });
});

module.exports = router;
