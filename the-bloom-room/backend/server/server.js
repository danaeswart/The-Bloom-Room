// const express = require("express");
// const cors = require("cors");
// const path = require("path");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/db.js";

//for image uploads
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 server.js is starting from server.js");

// Routes
import authRoutes from "./routes/auth.js";
import artworksRoutes from "./routes/artworks.js";
import artistRoutes from "./routes/artist.js";
import usersRoutes from "./routes/users.js";
import buyerRoutes from "./routes/buyer.js";
import ordersRoutes from "./routes/orders.js";


const app = express();


// Middleware
// app.use(cors());

//backend calls for web ---------------------------------------------
// app.use(cors({
//   origin: "https://the-bloom-room-frontend.onrender.com",
//   methods: ["GET","POST","PUT","DELETE"],
//   credentials: true
// }));

app.use(cors({ origin: "*" }));


app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


console.log("Buyer routes:", buyerRoutes);


app.use("/orders", ordersRoutes);


// Buyer routes
console.log("🛠 Buyer routes mounted at /buyer");
app.use("/buyer", buyerRoutes);




app.use("/users", usersRoutes);




//artist routes
app.use("/artist", artistRoutes);


// Static folder for uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Auth routes
app.use("/auth", authRoutes);

// Artworks routes (no auth middleware for now)
app.use("/artworks", artworksRoutes);
app.use("/artwork", artworksRoutes); // ✅ new line

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/test", (req, res) => res.json({ message: "Test route works! yay" }));




// Check all routes AFTER everything
console.log("Registered routes:");
if (app._router && app._router.stack) {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(middleware.route.path);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(handler.route.path);
        }
      });
    }
  });
} else {
  console.log("⚠️ No routes found yet");
}

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀:))))) Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("💥 Server error from server.js:", err);
  res.status(500).json({ message: "Internal server error" });
});
