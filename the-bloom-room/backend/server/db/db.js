const mysql = require("mysql2");
require('dotenv').config(); // now it will find it automatically
console.log("Environment Variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER, });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

module.exports = db;
