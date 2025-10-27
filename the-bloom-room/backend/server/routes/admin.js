import express from "express";
import bcrypt from "bcrypt";
import db from "../db/db.js";

const router = express.Router();

console.log("🚀 Admin routes loaded");

const DEFAULT_ADMIN_PW = "BloomRoom123!";

// Helper: create a default admin user + admin row if none exist
async function ensureDefaultAdmin(callback) {
  const findAdminSql = `SELECT Admin_ID FROM admin ORDER BY Admin_ID LIMIT 1`;
  db.query(findAdminSql, async (err, results) => {
    if (err) return callback(err);
    if (results && results.length > 0) return callback(null, results[0].Admin_ID);

    // create default user account
    const email = "admin@bloomroom.local";
    const username = "bloom_admin";
    const name = "Bloom";
    const surname = "Admin";
    const hashed = await bcrypt.hash(DEFAULT_ADMIN_PW, 10);

    const insertUserSql = `INSERT INTO users (Email, PasswordHash, Role, Username, Name, Surname, Status) VALUES (?, ?, 'admin', ?, ?, ?, 'verified')`;
    db.query(insertUserSql, [email, hashed, username, name, surname], (err2, result2) => {
      if (err2) return callback(err2);
      const userId = result2.insertId;
      // Some deployments may have removed Profile_url column; insert only User_ID to be safe
      const insertAdminSql = `INSERT INTO admin (User_ID) VALUES (?)`;
      db.query(insertAdminSql, [userId], (err3, result3) => {
        if (err3) {
          console.error("Error inserting admin row in ensureDefaultAdmin:", err3);
          return callback(err3);
        }
        console.log("Created default admin row, Admin_ID=", result3.insertId);
        return callback(null, result3.insertId);
      });
    });
  });
}

// Create admin account (manual endpoint)
router.post("/create", async (req, res) => {
  try {
    const { email, username, name, surname } = req.body;
    if (!email || !username || !name || !surname) {
      return res.status(400).json({ message: "email, username, name and surname are required" });
    }

    // check existing
    db.query("SELECT * FROM users WHERE Email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (results.length > 0) return res.status(400).json({ message: "User with that email already exists" });

      const hashed = await bcrypt.hash(DEFAULT_ADMIN_PW, 10);
      const insertUserSql = `INSERT INTO users (Email, PasswordHash, Role, Username, Name, Surname, Status) VALUES (?, ?, 'admin', ?, ?, ?, 'verified')`;
      db.query(insertUserSql, [email, hashed, username, name, surname], (err2, r2) => {
        if (err2) return res.status(500).json({ message: "Error creating user", error: err2 });
        const userId = r2.insertId;
        // Insert admin row with only User_ID (Profile_url may have been removed in schema)
        const insertAdminSql = `INSERT INTO admin (User_ID) VALUES (?)`;
        db.query(insertAdminSql, [userId], (err3, r3) => {
          if (err3) {
            console.error("Error inserting admin row:", err3);
            return res.status(500).json({ message: "Error inserting admin", error: err3 });
          }
          console.log("Admin row created, Admin_ID=", r3.insertId, "for User_ID=", userId);
          res.status(201).json({ message: "Admin created", adminId: r3.insertId, userId });
        });
      });
    });
  } catch (err) {
    console.error("Error in /admin/create", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Request verification (artist must have >= 5 artworks)
router.post("/verification/request", (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "user_id required" });

  // find artist id for this user
  db.query("SELECT Artist_ID FROM artist WHERE User_ID = ?", [user_id], (err, ares) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (!ares || ares.length === 0) return res.status(400).json({ message: "No artist profile found for user" });
    const artistId = ares[0].Artist_ID;

    // count artworks
    db.query("SELECT COUNT(*) AS cnt FROM artwork WHERE Artist_ID = ?", [artistId], (err2, cres) => {
      if (err2) return res.status(500).json({ message: "DB error", error: err2 });
      const count = (cres && cres[0] && cres[0].cnt) || 0;
      if (count < 5) return res.status(400).json({ message: "You need at least 5 artworks to request verification" });

      // ensure there's an admin to assign
      const getAdminSql = `SELECT Admin_ID FROM admin ORDER BY Admin_ID LIMIT 1`;
      db.query(getAdminSql, async (err3, admins) => {
        if (err3) return res.status(500).json({ message: "DB error", error: err3 });
        const proceedWithAdminId = (adminId) => {
          const insertApproval = `INSERT INTO approval (User_ID, Admin_ID, Approval_type) VALUES (?, ?, 'artist')`;
          db.query(insertApproval, [user_id, adminId], (err4, res4) => {
            if (err4) return res.status(500).json({ message: "Error creating approval request", error: err4 });
            res.json({ message: "Verification request created", approvalId: res4.insertId });
          });
        };

        if (admins && admins.length > 0) return proceedWithAdminId(admins[0].Admin_ID);

        // no admin exists -> create default admin then insert approval
        ensureDefaultAdmin((err4, newAdminId) => {
          if (err4) return res.status(500).json({ message: "Error creating default admin", error: err4 });
          proceedWithAdminId(newAdminId);
        });
      });
    });
  });
});

// List pending verification requests
router.get("/verification/requests", (req, res) => {
  const sql = `SELECT ap.Approval_ID, ap.User_ID, ap.Status, 
                 u.Username, u.Email, u.Name, u.Surname, 
                 a.Artist_ID, a.Bio
               FROM approval ap
               JOIN users u ON ap.User_ID = u.User_ID
               LEFT JOIN artist a ON a.User_ID = u.User_ID
               WHERE ap.Status = 'Pending'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    // for each result, fetch a couple of their artworks (images)
    const tasks = results.map(row => {
      return new Promise((resolve) => {
        if (!row.Artist_ID) return resolve({ ...row, artworks: [] });
        const artSql = `SELECT aw.Artwork_ID, ai.Image_URL FROM artwork aw LEFT JOIN artworkimages ai ON ai.Artwork_ID = aw.Artwork_ID WHERE aw.Artist_ID = ? LIMIT 6`;
        db.query(artSql, [row.Artist_ID], (err2, arts) => {
          if (err2) return resolve({ ...row, artworks: [] });
          resolve({ ...row, artworks: arts || [] });
        });
      });
    });

    Promise.all(tasks).then(data => res.json({ requests: data }));
  });
});

// Approve request
router.post("/verification/approve", (req, res) => {
  const { approval_id, admin_user_id } = req.body;
  if (!approval_id || !admin_user_id) return res.status(400).json({ message: "approval_id and admin_user_id required" });

  // find approval and its user
  db.query("SELECT * FROM approval WHERE Approval_ID = ?", [approval_id], (err2, ares) => {
    if (err2) return res.status(500).json({ message: "DB error", error: err2 });
    if (!ares || ares.length === 0) return res.status(404).json({ message: "Approval request not found" });
    const userId = ares[0].User_ID;

    // find admin record for this admin_user_id (admin table)
    db.query("SELECT Admin_ID FROM admin WHERE User_ID = ?", [admin_user_id], (err3, admins) => {
      if (err3) return res.status(500).json({ message: "DB error", error: err3 });
      const adminId = (admins && admins[0] && admins[0].Admin_ID) || null;

      const updateApproval = `UPDATE approval SET Status='Approved', Admin_ID = ? WHERE Approval_ID = ?`;
      db.query(updateApproval, [adminId, approval_id], (err4) => {
        if (err4) return res.status(500).json({ message: "DB error", error: err4 });
        // mark user as verified
        db.query("UPDATE users SET Status='verified' WHERE User_ID = ?", [userId], (err5) => {
          if (err5) return res.status(500).json({ message: "DB error", error: err5 });
          res.json({ message: "User approved and verified" });
        });
      });
    });
  });
});

// Decline request
router.post("/verification/decline", (req, res) => {
  const { approval_id, admin_user_id, reason } = req.body;
  if (!approval_id || !admin_user_id) return res.status(400).json({ message: "approval_id and admin_user_id required" });

  db.query("SELECT User_ID FROM users WHERE User_ID = ? AND Role = 'admin'", [admin_user_id], (err, ures) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (!ures || ures.length === 0) return res.status(403).json({ message: "You are not an admin" });

    const updateApproval = `UPDATE approval SET Status='Declined' WHERE Approval_ID = ?`;
    db.query(updateApproval, [approval_id], (err2) => {
      if (err2) return res.status(500).json({ message: "DB error", error: err2 });
      res.json({ message: "Verification request declined", reason: reason || null });
    });
  });
});

export default router;
