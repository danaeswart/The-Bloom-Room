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



router.put("/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  console.log("🔹 Received status update:", orderId, status);

  const validStatuses = ["Sold", "Declined", "Pending"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // Find artworkId for this order
  const findOrderSql = `SELECT Artwork_ID FROM orders WHERE Order_ID = ?`;
  db.query(findOrderSql, [orderId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const artworkId = results[0].Artwork_ID;

    if (status === "Sold") {
      // Approve this order, decline all others
      const sql = `
        UPDATE orders
        SET Status = CASE 
          WHEN Order_ID = ? THEN 'Sold'
          ELSE 'Declined'
        END
        WHERE Artwork_ID = ?
      `;
      db.query(sql, [orderId, artworkId], (err2) => {
        if (err2) {
          console.error("❌ SQL Error updating order statuses:", err2);
          return res.status(500).json({ error: "Database error" });
        }

        // Update artwork status to Sold
        const updateArtworkSql = `
          UPDATE artwork
          SET Status = 'Sold'
          WHERE Artwork_ID = ?
        `;
        db.query(updateArtworkSql, [artworkId], (err3) => {
          if (err3) {
            console.error("❌ SQL Error updating artwork status:", err3);
            return res.status(500).json({ error: "Database error" });
          }

          res.json({ message: "Order approved, artwork marked as Sold, others declined" });
        });
      });

    } else if (status === "Pending") {
      // Unapprove: revert all orders to Pending
      const revertSql = `
        UPDATE orders
        SET Status = 'Pending'
        WHERE Artwork_ID = ?
      `;
      db.query(revertSql, [artworkId], (err2) => {
        if (err2) {
          console.error("❌ SQL Error reverting order statuses:", err2);
          return res.status(500).json({ error: "Database error" });
        }

        // Update artwork status to Available
        const updateArtworkSql = `
          UPDATE artwork
          SET Status = 'Available'
          WHERE Artwork_ID = ?
        `;
        db.query(updateArtworkSql, [artworkId], (err3) => {
          if (err3) {
            console.error("❌ SQL Error updating artwork status:", err3);
            return res.status(500).json({ error: "Database error" });
          }

          res.json({ message: "Order unapproved, artwork marked as Available, all orders pending" });
        });
      });

    } else {
      // Decline single order
      const declineSql = `
        UPDATE orders
        SET Status = 'Declined'
        WHERE Order_ID = ?
      `;
      db.query(declineSql, [orderId], (err2) => {
        if (err2) {
          console.error("❌ SQL Error declining order:", err2);
          return res.status(500).json({ error: "Database error" });
        }

        // Optionally, you could set artwork to Unavailable if all orders declined
        res.json({ message: "Order declined" });
      });
    }
  });
});






//new code for the profile page to display the num or requests


// ✅ Get order counts per artwork for a specific artist

// router.get("/artist/:artistId/counts", (req, res) => {
//   console.log("🔹 Hit /orders/artist/:artistId/counts route");
//   console.log("req.params:", req.params);

//   const artistId = parseInt(req.params.artistId, 10);
//   if (isNaN(artistId)) {
//     console.log("❌ Invalid artistId:", req.params.artistId);
//     return res.status(400).json({ error: "Invalid artistId" });
//   }

//   const sql = `
//     SELECT a.Artwork_ID, 
//            COUNT(o.Artwork_ID) AS RequestCount
//     FROM artwork a
//     LEFT JOIN orders o 
//       ON a.Artwork_ID = o.Artwork_ID AND o.Status != 'Sold'
//     WHERE a.Artist_ID = ?
//     GROUP BY a.Artwork_ID
//   `;

//   db.query(sql, [artistId], (err, results) => {
//     if (err) {
//       console.error("❌ SQL Error (get counts):", err.sqlMessage, err);
//       return res.status(500).json({ error: "Failed to fetch order counts", details: err.sqlMessage });
//     }
//     console.log("✅ Counts data:", results);
//     res.json(results);
//   });
// });

// --------------------- comented this out


router.get("/artist/:artistId/counts", (req, res) => {
   console.log("🔹 Hit /artist/:artistId/counts route");
  const artistId = req.params.artistId;
  console.log("Fetching order counts for artist:", artistId);

  const sql = `
    SELECT 
      a.Artwork_ID, 
      COUNT(o.Artwork_ID) AS RequestCount
    FROM artwork a
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
  u.Surname AS Buyer_Surname,
  a.Artist_ID AS ArtistRequester_ID,
  au.Username AS Artist_Username
FROM orders o
LEFT JOIN buyer b ON o.Buyer_ID = b.Buyer_ID
LEFT JOIN users u ON b.User_ID = u.User_ID
LEFT JOIN artwork aw ON o.Artwork_ID = aw.Artwork_ID
LEFT JOIN artist a ON aw.Artist_ID = a.Artist_ID
LEFT JOIN users au ON a.User_ID = au.User_ID
WHERE o.Artwork_ID = ?;


  `;

  db.query(sql, [artworkId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});


// GET orders by User_ID
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT o.*, a.Artwork_ID
    FROM orders o
    JOIN artwork a ON o.Artwork_ID = a.Artwork_ID
    WHERE o.Buyer_ID = (
      SELECT Buyer_ID FROM buyer WHERE User_ID = ?
    )
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders for user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


module.exports = router;
