<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "../../config/database.php";

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing ID"]);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("DELETE FROM reviews WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(["message" => "Review deleted successfully"]);
