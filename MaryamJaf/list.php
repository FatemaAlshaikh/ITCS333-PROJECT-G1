<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "../../config/database.php";

$page = $_GET['page'] ?? 1;
$limit = 10;
$offset = ($page - 1) * $limit;

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT r.*, c.course_name FROM reviews r JOIN courses c ON r.course_id = c.id ORDER BY r.created_at DESC LIMIT ? OFFSET ?");
$stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
$stmt->bindValue(2, (int)$offset, PDO::PARAM_INT);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));