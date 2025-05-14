<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get course form data
    $course_name = $_POST['course_name'];
    $description = $_POST['description'];
    $uploader_name = $_POST['uploader_name'];

    // Insert course data into the database
    $sql = "INSERT INTO courses (course_name, description, uploader_name) VALUES (:course_name, :description, :uploader_name)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':course_name', $course_name);
    $stmt->bindValue(':description', $description);
    $stmt->bindValue(':uploader_name', $uploader_name);

    if ($stmt->execute()) {
        $course_id = $pdo->lastInsertId();  // Get the course ID

        // Handle file uploads
        if (isset($_FILES['files'])) {
            $files = $_FILES['files'];
            $file_count = count($files['name']);  // Number of files

            for ($i = 0; $i < $file_count; $i++) {
                $file_tmp = $files['tmp_name'][$i];
                $file_name = $files['name'][$i];
                $file_type = mime_content_type($file_tmp);
                $file_size = $files['size'][$i];
                $file_error = $files['error'][$i];

                // Validate file type (e.g., PDF, JPG, PNG)
                $allowed_types = ['image/jpeg', 'image/png', 'application/pdf'];
                
                if (in_array($file_type, $allowed_types)) {
                    // Define upload directory path
                    $upload_dir = "uploads\\";
                    $target_file = $upload_dir . basename($file_name);

                    // Move file from temporary location to target directory
                    if (move_uploaded_file($file_tmp, $target_file)) {
                        // Insert file details into the database
                        $sql_file = "INSERT INTO course_files (course_id, file_name, file_type, file_data) VALUES (:course_id, :file_name, :file_type, :file_data)";
                        $stmt_file = $pdo->prepare($sql_file);
                        $stmt_file->bindValue(':course_id', $course_id, PDO::PARAM_INT);
                        $stmt_file->bindValue(':file_name', $file_name);
                        $stmt_file->bindValue(':file_type', $file_type);
                        $stmt_file->bindValue(':file_data', file_get_contents($target_file));  // Optional: Storing file content
                        $stmt_file->execute();
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'File upload failed for ' . $file_name]);
                        exit;
                    }
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid file type for ' . $file_name]);
                    exit;
                }
            }
        }

        echo json_encode(['status' => 'success', 'message' => 'Course added successfully with files.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add course.']);
    }
}
?>
