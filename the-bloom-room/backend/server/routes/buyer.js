const express = require("express");
const router = express.Router();
const db = require("../db/db");

console.log("🚀 Buyer route file loaded with routes: /test and /:userID");


router.get("/test", (req, res) => {
  console.log("Buyer test route hit");
  res.json({ message: "Buyer route is working" });
});

// === GET buyer by User_ID === //
router.get("/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    // Fetch buyer
    const [buyer] = await db.query("SELECT * FROM buyer WHERE User_ID = ?", [userID]);

    if (!buyer.length) {
      console.log(`⚠️ No buyer found for User_ID=${userID}, creating a new one...`);

      // Insert a new buyer entry
      await db.query("INSERT INTO buyer (User_ID, Bio, Profile_url) VALUES (?, '', '')", [userID]);

      // Re-fetch the newly created buyer
      const [newBuyer] = await db.query("SELECT * FROM buyer WHERE User_ID = ?", [userID]);

      return res.json(newBuyer[0]); // Return single object
    }

    res.json(buyer[0]); // Return existing buyer object
  } catch (err) {
    console.error("Error fetching buyer:", err);
    res.status(500).json({ error: "Server error fetching buyer" });
  }
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

