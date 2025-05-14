<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$apiUrl = 'http://localhost/api.php?action=add_event';
$curl = curl_init();
$file = $_FILES['event-image'] ?? null;
$filePath = $file ? new CURLFile($file['tmp_name'], $file['type'], $file['name']) : null;
$postData = [
'event-name' => $_POST['event-name'],
'event-date' => $_POST['event-date'],
'event-time' => $_POST['event-time'],
'event-type' => $_POST['event-type'],
'contact-info' => $_POST['contact-info'],
'event-description' => $_POST['event-description'],
'event-image' => $filePath
];
curl_setopt_array($curl, [
CURLOPT_URL => $apiUrl,
CURLOPT_POST => true,
CURLOPT_RETURNTRANSFER => true,
CURLOPT_POSTFIELDS => $postData,
]);
$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
if ($httpCode === 201) {
header('Location: success.html');
} else {
echo 'Error: ' . $response;
}
} else {
echo 'Invalid request method.';
?>                    