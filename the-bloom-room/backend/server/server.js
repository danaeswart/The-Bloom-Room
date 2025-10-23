// // const express = require("express");
// // const cors = require("cors");
// // const path = require("path");

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import db from "./db/db.js";

// //for image uploads
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log("🚀 server.js is starting from server.js");

// // Routes
// import authRoutes from "./routes/auth.js";
// import artworksRoutes from "./routes/artworks.js";
// import artistRoutes from "./routes/artist.js";
// import usersRoutes from "./routes/users.js";
// import buyerRoutes from "./routes/buyer.js";
// import ordersRoutes from "./routes/orders.js";


// const app = express();


// // Middleware
// // app.use(cors());

// //backend calls for web ---------------------------------------------
// app.use(cors({
//   origin: "https://the-bloom-room-frontend.onrender.com",
//   methods: ["GET","POST","PUT","DELETE"],
//   credentials: true
// }));

// // app.use(cors({ origin: "*" }));


// app.use(express.json());


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// console.log("Buyer routes:", buyerRoutes);


// app.use("/orders", ordersRoutes);


// // Buyer routes
// console.log("🛠 Buyer routes mounted at /buyer");
// app.use("/buyer", buyerRoutes);




// app.use("/users", usersRoutes);




// //artist routes
// app.use("/artist", artistRoutes);


// // Static folder for uploaded images
// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // Auth routes
// app.use("/auth", authRoutes);

// // Artworks routes (no auth middleware for now)
// // app.use("/artworks", artworksRoutes);
// app.use("/artwork", artworksRoutes);

// // Root test route
// app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

// app.get("/test", (req, res) => res.json({ message: "Test route works! yay" }));




// // Check all routes AFTER everything
// console.log("Registered routes:");
// if (app._router && app._router.stack) {
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       console.log(middleware.route.path);
//     } else if (middleware.name === "router") {
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           console.log(handler.route.path);
//         }
//       });
//     }
//   });
// } else {
//   console.log("⚠️ No routes found yet");
// }

// // // Start server
// // const PORT = 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀:))))) Server running on port ${PORT}`);
// });

// app.use((err, req, res, next) => {
//   console.error("💥 Server error from server.js:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import artworksRoutes from "./routes/artworks.js";
import artistRoutes from "./routes/artist.js";
import usersRoutes from "./routes/users.js";
import buyerRoutes from "./routes/buyer.js";
import ordersRoutes from "./routes/orders.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// CORS
// =========================
// Enable CORS and handle preflight
const allowedOrigins = [
  "https://the-bloom-room-frontend.onrender.com",
  "https://the-bloom-room-5.onrender.com",
  "http://localhost:3000" ,
  "http://localhost:5000"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow requests like Postman or same-origin
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// ✅ Handle preflight
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Handle OPTIONS preflight globally
// app.options("*", cors());



// =========================
// Middleware
// =========================

// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // static images

// =========================
// Routes
// =========================
console.log("🚀 Mounting auth routes at /auth");
app.use("/auth", authRoutes);

console.log("🚀 Mounting artwork routes at /artwork");
app.use("/artwork", artworksRoutes);

console.log("🚀 Mounting artist routes at /artist");
app.use("/artist", artistRoutes);

console.log("🚀 Mounting users routes at /users");
app.use("/users", usersRoutes);

console.log("🚀 Mounting buyer routes at /buyer");
app.use("/buyer", buyerRoutes);

console.log("🚀 Mounting orders routes at /orders");
app.use("/orders", ordersRoutes);


// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route works! yay 🎉" });
});

// =========================
// Error Handling
// =========================
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(500).json({ message: "Internal server error", details: err.message });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// =========================
// Debugging: list routes
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  if (app._router && Array.isArray(app._router.stack)) {
    console.log("📌 Registered routes:");
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(middleware.route.path);
      } else if (middleware.name === "router" && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) console.log(handler.route.path);
        });
      }
    });
  }
});




// if (app._router && app._router.stack) {
//   console.log("📌 Registered routes:");
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       console.log(middleware.route.path);
//     } else if (middleware.name === "router") {
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           console.log(handler.route.path);
//         }
//       });
//     }
//   });
// } else {
//   console.log("⚠️ No routes found yet");
// }

// console.log("📌 Registered routes:");

// if (app._router && Array.isArray(app._router.stack)) {
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       console.log(middleware.route.path);
//     } else if (middleware.name === "router" && middleware.handle && Array.isArray(middleware.handle.stack)) {
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route) {
//           console.log(handler.route.path);
//         }
//       });
//     }
//   });
// } else {
//   console.log("⚠️ No routes found yet");
// }