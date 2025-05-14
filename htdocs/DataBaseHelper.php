<?php
class DatabaseHelper {
private $pdo;
public function __construct($host, $dbname, $username, $password, $options = []) {
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
$defaultOptions = [
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
$options = array_replace($defaultOptions, $options);
$this->pdo = new PDO($dsn, $username, $password, $options);
}
public function registerAttendee($name, $email, $phone, $eventId, $comments) {
$sql = "INSERT INTO attendees (name, email, phone, event_id, comments) VALUES (:name, :email, :phone, :event_id, :comments)";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([
':name' => $name,
':email' => $email,
':phone' => $phone,
':event_id' => $eventId,
':comments' => $comments
]);
}
public function createEvent($name, $date, $time, $type, $contact, $imagePath, $description) {
$sql = "INSERT INTO events (name, date, time, type, contact, image, description) VALUES (:name, :date, :time, :type, :contact, :image, :description)";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([
':name' => $name,
':date' => $date,
':time' => $time,
':type' => $type,
':contact' => $contact,
':image' => $imagePath,
':description' => $description
]);
}
public function getAllEvents($limit = 10, $offset = 0, $type = null, $date = null) {
$sql = "SELECT * FROM events WHERE 1=1";
$params = [];
if ($type) {
$sql .= " AND type = :type";
$params[':type'] = $type;
}
if ($date) {
$sql .= " AND date = :date";
$params[':date'] = $date;
}
if ($type && $date) {
$sql .= " AND type = :type AND date = :date"; //
}
$sql .= " ORDER BY date DESC LIMIT :limit OFFSET :offset";
$stmt = $this->pdo->prepare($sql);
$stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
foreach ($params as $key => $value) {
$stmt->bindValue($key, $value);
}
$stmt->execute();
return $stmt->fetchAll();
}
public function getEventById($id) {
$sql = "SELECT * FROM events WHERE id = :id";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([':id' => $id]);
return $stmt->fetch();
}
public function updateEvent($id, $name, $date, $time, $type, $contact, $description) {
$sql = "UPDATE events SET name = :name, date = :date, time = :time, type = :type, contact = :contact, description = :description WHERE id = :id";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([
':id' => $id,
':name' => $name,
':date' => $date,
':time' => $time,
':type' => $type,
':contact' => $contact,
':description' => $description
]);
}
public function deleteEvent($id) {
$sql = "DELETE FROM events WHERE id = :id";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([':id' => $id]);
}
public function searchEvents($keyword) {
$sql = "SELECT * FROM events WHERE name LIKE :keyword OR description LIKE :keyword";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([':keyword' => '%' . $keyword . '%']);
return $stmt->fetchAll();
}
public function getAttendeesByEvent($eventId) {
$sql = "SELECT * FROM attendees WHERE event_id = :event_id";
$stmt = $this->pdo->prepare($sql);
$stmt->execute([':event_id' => $eventId]);
return $stmt->fetchAll();
}
} 
?> 