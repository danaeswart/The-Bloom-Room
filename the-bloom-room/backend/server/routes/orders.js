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
    SELECT 
      a.Artwork_ID, 
      COUNT(o.Artwork_ID) AS RequestCount
    FROM artworks a
    LEFT JOIN orders o 
      ON a.Artwork_ID = o.Artwork_ID 
      AND o.Status != 'Sold' -- Ignore sold orders
    WHERE a.Artist_ID = ?
      AND NOT EXISTS (
        SELECT 1 FROM orders o2 
        WHERE o2.Artwork_ID = a.Artwork_ID AND o2.Status = 'Sold'
      ) -- Ignore artworks that are sold
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
      u.Username AS Buyer_Username,
      u.Name AS Buyer_Name,
      u.Surname AS Buyer_Surname
    FROM orders o
    JOIN buyer b ON o.Buyer_ID = b.Buyer_ID
    JOIN users u ON b.User_ID = u.User_ID
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

router.put("/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

    console.log("🔹 Received status update:", orderId, status); // DEBUG
  // Only allow specific status values for safety
  const validStatuses = ["Sold", "Declined"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const sql = `UPDATE orders SET Status = ? WHERE Order_ID = ?`;

  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error("❌ Error updating order status:", err);
      return res.status(500).json({ error: "Database update error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`✅ Order ${orderId} status updated to: ${status}`);
    res.json({ message: "Status updated successfully", status });
  });
});

module.exports = router;
