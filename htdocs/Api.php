<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';
require_once 'DatabaseHelper.php';
$db = new DatabaseHelper(
$config['host'],
$config['dbname'],
$config['username'],
$config['password'],
$config['options']
);
$action = $_GET['action'] ?? '';
switch ($action) {
case 'register_attendee': registerAttendee($db); break;
case 'add_event': addEvent($db); break;
case 'get_events': getEvents($db); break;
case 'get_event': getEvent($db); break;
case 'update_event': updateEvent($db); break;
case 'delete_event': deleteEvent($db); break;
case 'search_events': searchEvents($db); break;
case 'get_attendees': getAttendees($db); break;
default:
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
break;
}
// register_attendee
function registerAttendee($db) {
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
return;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['name'], $data['email'], $data['event'])) {
http_response_code(422);
echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
return;
}
$name = htmlspecialchars(trim($data['name']));
$email = htmlspecialchars(trim($data['email']));
$phone = htmlspecialchars(trim($data['phone'] ?? ''));
$eventId = (int)$data['event'];
$comments = htmlspecialchars(trim($data['comments'] ?? ''));
try {
$db->registerAttendee($name, $email, $phone, $eventId, $comments);
http_response_code(201);
echo json_encode(['status' => 'success', 'message' => 'Registered successfully']);
} catch (PDOException $e) {
http_response_code(500);
echo json_encode(['status' => 'error', 'message' => 'DB error: ' . $e->getMessage()]);
}
}
//add_event
function addEvent($db) {
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
return;
}
$name = htmlspecialchars($_POST['event-name'] ?? '');
$date = $_POST['event-date'] ?? '';
$time = $_POST['event-time'] ?? '';
$type = $_POST['event-type'] ?? '';
$contact = htmlspecialchars($_POST['contact-info'] ?? '');
$description = htmlspecialchars($_POST['event-description'] ?? '');
$imagePath = '';
// Upload image
if (isset($_FILES['event-image']) && $_FILES['event-image']['error'] === UPLOAD_ERR_OK) {
$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
$fileTmp = $_FILES['event-image']['tmp_name'];
$fileName = basename($_FILES['event-image']['name']);
$targetFile = $uploadDir . $fileName;
$fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($fileType, $allowedTypes)) {
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid image type']);
return;
}
if (move_uploaded_file($fileTmp, $targetFile)) {
$imagePath = $targetFile;
}
}
if (!$name || !$date || !$time || !$type || !$contact || !$description) {
http_response_code(422);
echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
return;
}
try {
$db->createEvent($name, $date, $time, $type, $contact, $imagePath, $description);
http_response_code(201);
echo json_encode(['status' => 'success', 'message' => 'Event created successfully']);
} catch (PDOException $e) {
http_response_code(500);
echo json_encode(['status' => 'error', 'message' => 'DB error: ' . $e->getMessage()]);
}
}
// get_events
function getEvents($db) {
$limit = (int)($_GET['limit'] ?? 10);
$offset = (int)($_GET['offset'] ?? 0);
$type = $_GET['type'] ?? null;
$date = $_GET['date'] ?? null;
echo json_encode($db->getAllEvents($limit, $offset, $type, $date));
}
//get_event
function getEvent($db) {
$id = $_GET['id'] ?? null;
if ($id === null) {
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Missing ID']);
return;
}
echo json_encode($db->getEventById((int)$id));
}
//update_event
function updateEvent($db) {
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
return;
}
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'], $data['name'], $data['date'], $data['time'], $data['type'], $data['contact'], $data['description'])) {
http_response_code(422);
echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
return;
}
try {
$db->updateEvent(
(int)$data['id'],
htmlspecialchars($data['name']),
$data['date'],
$data['time'],
htmlspecialchars($data['type']),
htmlspecialchars($data['contact']),
htmlspecialchars($data['description'])
);
echo json_encode(['status' => 'success', 'message' => 'Event updated']);
} catch (PDOException $e) {
http_response_code(500);
echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
}
// delete_event
function deleteEvent($db) {
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
return;
}
$id = $_GET['id'] ?? null;
if ($id === null) {
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Missing ID']);
return;
}
try {
$db->deleteEvent((int)$id);
echo json_encode(['status' => 'success', 'message' => 'Event deleted']);
} catch (PDOException $e) {
http_response_code(500);
echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
}
//search_events
function searchEvents($db) {
$keyword = $_GET['keyword'] ?? '';
echo json_encode($db->searchEvents($keyword));
}
//get_attendees
function getAttendees($db) {
$eventId = $_GET['event_id'] ?? null;
if ($eventId === null) {
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Missing event ID']);
return;
}
echo json_encode($db->getAttendeesByEvent((int)$eventId));
} 
?>                                          