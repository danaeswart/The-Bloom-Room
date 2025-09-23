// // db.js
const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "the_bloom_room",
});

// Wrap connection with promise support
const dbPromise = db.promise();

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

module.exports = dbPromise;
