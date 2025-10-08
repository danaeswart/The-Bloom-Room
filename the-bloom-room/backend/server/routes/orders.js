const express = require("express");
const db = require("../db/db");

const router = express.Router();


router.post("/", (req, res) => {
  console.log("🛒 POST /orders body:", req.body);

  const { Artwork_ID, Buyer_ID, Status, Message } = req.body;

  if (!Artwork_ID || !Buyer_ID || !Status) {
    console.log("❌ Missing required fields", { Artwork_ID, Buyer_ID, Status });
    return res.status(400).json({ error: "Artwork_ID, Buyer_ID and Status are required" });
  }

  const sql = `
    INSERT INTO orders (Artwork_ID, Buyer_ID, Status, RequestedAt, Message)
    VALUES (?, ?, ?, NOW(), ?)
  `;

  db.query(sql, [Artwork_ID, Buyer_ID, Status, Message || ""], (err, result) => {
    if (err) {
      console.error("❌ SQL Insert Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    console.log("✅ Order inserted:", result);
    res.json({ message: "Order requested successfully", orderId: result.insertId });
  });
});
module.exports = router;