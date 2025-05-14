<?php
include 'db.php';

$id = $_GET['id'];

$sql = "SELECT * FROM courses WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$course = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($course);
?>
