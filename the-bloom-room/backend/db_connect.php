<?php
$host = "bloomroomdb-database-bloom-room.e.aivencloud.com";
$port = 22268;
$database = "defaultdb";
$username = "avnadmin";
$password = "AVNS_jSlOFM-gJQo7hYYVQ9X";

// Enable SSL
$ssl_ca = __DIR__ . '/ca.pem'; // We'll download this in the next step

// Create connection
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, $ssl_ca, NULL, NULL);
mysqli_real_connect($conn, $host, $username, $password, $database, $port, MYSQLI_CLIENT_SSL);

// Check connection
if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL: " . mysqli_connect_error());
} else {
    echo "✅ Connected successfully to Aiven MySQL!";
}
?>
