<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['rating'], $data['comment'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("UPDATE reviews SET rating = ?, comment = ? WHERE id = ?");
$stmt->execute([
    htmlspecialchars($data['rating']),
    htmlspecialchars($data['comment']),
    htmlspecialchars($data['id'])
]);

echo json_encode(["message" => "Review updated successfully"]);
