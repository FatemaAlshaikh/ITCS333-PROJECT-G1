<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>PHP + PlanetScale</title>
    <meta charset="UTF-8">
</head>
<body>
<?php
// Retrieve credentials from environment variables
$host = getenv("DB_HOST");  // PlanetScale host (e.g., your-database-host.region.planetscale.app)
$user = getenv("DB_USER");  // PlanetScale username
$pass = getenv("DB_PASSWORD");  // PlanetScale password
$db = getenv("DB_NAME");  // Your PlanetScale database name

// Establish a new MySQL connection
$conn = new mysqli($host, $user, $pass, $db);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// If connected successfully, display success message
echo "<p>DATABASE connected successfully!</p>";

// Close the connection
$conn->close();
?>
</body>
</html>
