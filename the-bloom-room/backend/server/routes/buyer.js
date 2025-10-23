import express from "express";
import db from "../db/db.js";      // note the .js at the end
import multer from "multer";
import path from "path";

const router = express.Router();

console.log("🚀 Buyer route file loaded with routes: /test and /:userID");


router.get("/orders/:buyerID", async (req, res) => {
  const { buyerID } = req.params;

  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE Buyer_ID = ?", [buyerID]);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch buyer orders" });
  }
});

router.delete("/:orderID", async (req, res) => {
  const { orderID } = req.params;
  try {
    await db.query("DELETE FROM orders WHERE Order_ID = ?", [orderID]);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});


// === GET buyer by User_ID ===
router.get("/:userID", (req, res) => {
  console.log("it gets here ");
  const { userID } = req.params;
  console.log("Fetching buyer with User_ID:", userID);

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
router.put("/:userID", (req, res) => {
  const { userID } = req.params;
  const { bio } = req.body;

  if (bio === undefined) {
    return res.status(400).json({ error: "No bio provided for update" });
  }

  db.query("UPDATE buyer SET Bio = ? WHERE User_ID = ?", [bio, userID], (err, result) => {
    if (err) {
      console.error("Error updating buyer bio:", err);
      return res.status(500).json({ error: "Error updating buyer bio" });
    }

    db.query("SELECT * FROM buyer WHERE User_ID = ?", [userID], (err2, updatedBuyer) => {
      if (err2) {
        console.error("Error fetching updated buyer:", err2);
        return res.status(500).json({ error: "Error fetching updated buyer" });
      }

      res.json({ message: "Buyer bio updated successfully", buyer: updatedBuyer[0] });
    });
  });
});






// export router for ES modules
export default router;
