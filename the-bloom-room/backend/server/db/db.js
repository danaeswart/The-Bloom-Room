// const mysql = require("mysql2");
// require('dotenv').config(); // now it will find it automatically
// console.log("Environment Variables:", {
//   DB_HOST: process.env.DB_HOST,
//   DB_USER: process.env.DB_USER, });

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL database");
//   }
// });

// module.exports = db;



// backend/server/db/db.js
import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path"; 
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables from .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caPath = path.resolve(__dirname, "../../ca.pem");
console.log("🔍 Loading CA cert from:", caPath);
// Read the CA certificate (place ca.pem in the same folder or adjust the path)
const ca = fs.readFileSync(caPath);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { ca } // Use the certificate for a secure connection
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed on da web:", err);
  } else {
    console.log("✅ Connected to MySQL database on da web");
  }
});

export default db;
