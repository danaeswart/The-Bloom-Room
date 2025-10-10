const express = require("express");
const db = require("../db/db");
const router = express.Router();

// === Create new order (default status = Pending) ===
router.post("/", (req, res) => {
  

  const { Artwork_ID, Buyer_ID, Message } = req.body;

  if (!Artwork_ID || !Buyer_ID) {
    return res
      .status(400)
      .json({ error: "Artwork_ID and Buyer_ID are required" });
  }

  // Step 1: Find actual Buyer_ID from buyer table using User_ID
  const buyerQuery = `SELECT Buyer_ID FROM buyer WHERE User_ID = ?`;
  db.query(buyerQuery, [Buyer_ID], (err, result) => {
    if (err) {
      console.error("❌ Error fetching buyer record:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Buyer record not found for this user" });
    }

    const realBuyerId = result[0].Buyer_ID;

    // Step 2: Insert order with default "Pending" status
    const insertSql = `
      INSERT INTO orders (Artwork_ID, Buyer_ID, Status, RequestedAt, Message)
      VALUES (?, ?, 'Pending', NOW(), ?)
    `;

    db.query(insertSql, [Artwork_ID, realBuyerId, Message || ""], (err2, result2) => {
      if (err2) {
        console.error("❌ SQL Insert Error:", err2);
        return res.status(500).json({ error: "Database insert error", details: err2 });
      }

   
      res.json({ message: "Order requested successfully", orderId: result2.insertId, status: "Pending" });
    });
  });
});

//new code for the profile page to display the num or requests

// ✅ Get order counts per artwork for a specific artist
router.get("/artist/:artistId/counts", (req, res) => {
  const artistId = req.params.artistId;

  const sql = `
    SELECT a.Artwork_ID, COUNT(o.Artwork_ID) AS RequestCount
    FROM artworks a
    LEFT JOIN orders o ON a.Artwork_ID = o.Artwork_ID
    WHERE a.Artist_ID = ?
    GROUP BY a.Artwork_ID;
  `;

  db.query(sql, [artistId], (err, results) => {
    if (err) {
      console.error("❌ SQL Error (get counts):", err);
      return res.status(500).json({ error: "Failed to fetch order counts" });
    }
    console.log("✅ Counts data:", results);
    res.json(results);
  });
});


// get orders and show to artist user
router.get("/artwork/:artworkId", (req, res) => {
  const { artworkId } = req.params;

  const sql = `
    SELECT 
      o.Order_ID,
      o.Artwork_ID,
      o.Buyer_ID,
      o.Status,
      o.RequestedAt,
      o.Message,
      b.Username AS Buyer_Username,
      b.Name AS Buyer_Name
    FROM orders o
    JOIN buyer b ON o.Buyer_ID = b.Buyer_ID
    WHERE o.Artwork_ID = ?
  `;

  db.query(sql, [artworkId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});


module.exports = router;
