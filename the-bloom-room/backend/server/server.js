const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth");
const artworksRoutes = require("./routes/artworks");
const artistRoutes = require("./routes/artist");
const usersRoutes = require("./routes/users");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);


//artist routes
app.use("/artist", artistRoutes);

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Auth routes
app.use("/auth", authRoutes);

// Artworks routes (no auth middleware for now)
app.use("/artworks", artworksRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
