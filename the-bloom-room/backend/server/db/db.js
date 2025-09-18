const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",    // XAMPP MySQL runs locally
  user: "root",          // default XAMPP username
  password: "",          // default XAMPP password is empty
  database: "the_bloom_room"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

module.exports = db;
