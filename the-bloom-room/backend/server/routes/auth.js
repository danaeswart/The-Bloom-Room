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
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO Users (Email, PasswordHash, Role, Username, Name, Surname, Status)
      VALUES (?, ?, ?, ?, ?, ?, 'unverified')
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





//login logic

// router.post("/login", async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required." });
//   }

//   try {
//     const query = "SELECT * FROM users WHERE email = ? AND role = ?";
//     db.query(query, [email, role], async (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Database error." });
//       }

//       if (results.length === 0) {
//         return res.status(400).json({ message: "User not found." });
//       }

//       const user = results[0];

//       const passwordMatch = await bcrypt.compare(password, user.password_hash);
//       if (!passwordMatch) {
//         return res.status(400).json({ message: "Incorrect password." });
//       }

//       // Login successful
//       res.json({
//         message: "Login successful!",
//         user: {
//           user_id: user.user_id,
//           email: user.email,
//           username: user.username,
//           role: user.role,
//           name: user.name,
//           surname: user.surname,
//           status: user.status
//         }
//       });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error." });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Example query for MySQL
    db.query(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role],
      (err, results) => {
        if (err) {
          console.error("Database query error:", err); // <-- log this
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "User not found" });
        }

        const user = results[0];

        // Here you would check password hash
        // For now, just send user
        res.json({ user });
      }
    );
  } catch (err) {
    console.error("Login route error:", err); // <-- log this too
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;