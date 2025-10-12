const express = require("express");
const router = express.Router();
const db = require("../db/db");

console.log("🚀 Buyer route file loaded with routes: /test and /:userID");


router.get("/test", (req, res) => {
  console.log("Buyer test route hit");
  res.json({ message: "Buyer route is working" });
});
// === GET buyer by User_ID ===
router.get("/:userID", (req, res) => {
  const { userID } = req.params;

  const sql = "SELECT * FROM buyer WHERE User_ID = ?";

  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching buyer:", err);
      return res.status(500).json({ error: "Server error fetching buyer" });
    }

    if (!results.length) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    res.json(results[0]);
  });
});


// === UPDATE buyer bio only === //
router.put("/:userID", async (req, res) => {
  const { userID } = req.params;
  const { bio } = req.body;

  try {
    if (bio === undefined) {
      return res.status(400).json({ error: "No bio provided for update" });
    }

    await db.query("UPDATE buyer SET Bio = ? WHERE User_ID = ?", [bio, userID]);

    const [updatedBuyer] = await db.query("SELECT * FROM buyer WHERE User_ID = ?", [userID]);
    res.json({ message: "Buyer bio updated successfully", buyer: updatedBuyer[0] });
  } catch (err) {
    console.error("Error updating buyer bio:", err);
    res.status(500).json({ error: "Error updating buyer bio" });
  }
});
module.exports = router;

