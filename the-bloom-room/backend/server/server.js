const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth");
const artworksRoutes = require("./routes/artworks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
// Auth routes
app.use("/auth", authRoutes);

// Artworks routes (no auth middleware for now)
app.use("/artworks", artworksRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Start server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});;
