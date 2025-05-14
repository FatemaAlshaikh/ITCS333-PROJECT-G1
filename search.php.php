<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "../../config/database.php";

$q = $_GET['q'] ?? '';
$search = "%" . $q . "%";

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT r.*, c.course_name FROM reviews r JOIN courses c ON r.course_id = c.id WHERE c.course_name LIKE ? OR r.comment LIKE ?");
$stmt->execute([$search, $search]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
