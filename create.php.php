<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['course_id'], $data['reviewer_name'], $data['rating'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("INSERT INTO reviews (course_id, reviewer_name, rating, comment) VALUES (?, ?, ?, ?)");
$stmt->execute([
    htmlspecialchars($data['course_id']),
    htmlspecialchars($data['reviewer_name']),
    htmlspecialchars($data['rating']),
    htmlspecialchars($data['comment'] ?? "")
]);

echo json_encode(["message" => "Review created successfully"]);