import mysql from "mysql2";
import fs from "fs";

// Read the CA certificate
const ca = fs.readFileSync("ca.pem");

const connection = mysql.createConnection({
  host: "bloomroomdb-database-bloom-room.e.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_jSlOFM-gJQo7hYYVQ9X",
  database: "defaultdb",
  port: 22268,
  ssl: {
    ca: ca
  }
});

connection.connect(err => {
  if (err) {
    console.error("❌ Error connecting to Aiven MySQL:", err);
  } else {
    console.log("✅ Successfully connected to Aiven MySQL!");
    connection.end();
  }
});
