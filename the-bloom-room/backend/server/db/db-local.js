// backend/server/db/db.js - Local Development Version
import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path"; 
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables from .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Database configuration:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

let db;

// Check if we're in development mode and using localhost
if (process.env.NODE_ENV === 'development' && process.env.DB_HOST === 'localhost') {
  console.log("🏠 Using local MySQL connection");
  
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bloom_room_db',
    port: process.env.DB_PORT || 3306,
    // No SSL for local development
  });
} else {
  console.log("☁️ Using cloud MySQL connection with SSL");
  
  // For production/cloud database with SSL
  const caPath = path.resolve(__dirname, "../../ca.pem");
  console.log("🔍 Loading CA cert from:", caPath);
  
  let ca;
  try {
    ca = fs.readFileSync(caPath);
  } catch (error) {
    console.warn("⚠️ Could not read CA certificate, proceeding without SSL");
  }

  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: ca ? { ca } : false
  });
}

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    console.error("💡 Make sure MySQL is running and credentials are correct");
    
    // Provide helpful error messages
    if (err.code === 'ECONNREFUSED') {
      console.error("🔧 Try: Start your MySQL server or check if it's running on the correct port");
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("🔧 Try: Check your username and password in the .env file");
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error("🔧 Try: Create the database first or check the database name");
    }
  } else {
    console.log("✅ Connected to MySQL database successfully!");
  }
});

export default db;