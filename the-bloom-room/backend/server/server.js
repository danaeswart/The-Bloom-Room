const express = require("express");
const cors = require("cors");
const path = require("path");

console.log("🚀 server.js is starting");

// Routes
const authRoutes = require("./routes/auth");
const artworksRoutes = require("./routes/artworks");
const artistRoutes = require("./routes/artist");
const usersRoutes = require("./routes/users");
const buyerRoutes = require("./routes/buyer"); 
const ordersRoutes = require("./routes/orders");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

console.log("Buyer routes:", buyerRoutes);


app.use("/orders", ordersRoutes);


// Buyer routes
console.log("🛠 Buyer routes mounted at /buyer");
app.use("/buyer", buyerRoutes);




app.use("/users", usersRoutes);




//artist routes
app.use("/artist", artistRoutes);


// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Auth routes
app.use("/auth", authRoutes);

// Artworks routes (no auth middleware for now)
app.use("/artworks", artworksRoutes);
app.use("/artwork", artworksRoutes); // ✅ new line

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});




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

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

