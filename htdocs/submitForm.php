<?php
// Check if the request method is POST (i.e., the form was submitted)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Set the API endpoint URL for adding a new event
    $apiUrl = 'http://localhost/api.php?action=add_event';
    // Initialize a cURL session
    $curl = curl_init();
    // Check if an image file was uploaded with the form
    $file = $_FILES['event-image'] ?? null;
    // Convert the uploaded file to a CURLFile object if it exists
    $filePath = $file ? new CURLFile($file['tmp_name'], $file['type'], $file['name']) : null;
    // Prepare the form data to be sent via POST
    $postData = [
        'event-name' => $_POST['event-name'],
        'event-date' => $_POST['event-date'],
        'event-time' => $_POST['event-time'],
        'event-type' => $_POST['event-type'],
        'contact-info' => $_POST['contact-info'],
        'event-description' => $_POST['event-description'],
        'event-image' => $filePath // Image file (if uploaded)
    ];
    // Set cURL options for making the POST request
    curl_setopt_array($curl, [
        CURLOPT_URL => $apiUrl, // Target API URL
        CURLOPT_POST => true, // Set request method to POST
        CURLOPT_RETURNTRANSFER => true, // Return the response as a string
        CURLOPT_POSTFIELDS => $postData, // Attach the form data
    ]);
    // Execute the cURL request and get the response
    $response = curl_exec($curl);
    // Get the HTTP status code of the response
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    // Close the cURL session
    curl_close($curl);
    // Check if the event was created successfully (HTTP 201 Created)
    if ($httpCode === 201) {
        // Redirect to a success page
        header('Location: success.html');
    } else {
        // Display an error message with the API response
        echo 'Error: ' . $response;
    }
} else {
    // If the request method is not POST, show an error message
    echo 'Invalid request method.';
}
?>
