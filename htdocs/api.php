
<?php
session_start();
header('Content-Type: application/json');

require_once 'config.php';
require_once 'DatabaseHelper.php';

// Create database helper
$db = new DatabaseHelper(
    $config['host'],
    $config['dbname'],
    $config['username'],
    $config['password'],
    $config['options']
);

// Handle different API endpoints
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'register':
        register($db);
        break;
    case 'login':
        login($db);
        break;
    case 'logout':
        logout();
        break;
    case 'group':
        getGroup($db);
        break;
    case 'delete':
        deleteGroup($db);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}

function register($db) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username']) || !isset($data['password']) || !isset($data['email'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        return;
    }

    $username = $data['username'];
    $password = $data['password'];
    $email = $data['email'];

    if (strlen($username) < 3) {
        echo json_encode(['status' => 'error', 'message' => 'Username must be at least 3 characters']);
        return;
    }

    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters']);
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        return;
    }

    try {
        
        $result = $db->registerUser($username, $password, $email);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
        }
    } catch (PDOException $e) {
     
        if ($e->getCode() == 23000) {
            echo json_encode(['status' => 'error', 'message' => 'Username or email already exists']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
}


function login($db) {
    
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username']) || !isset($data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        return;
    }

    $username = $data['username'];
    $password = $data['password'];
    $rememberMe = isset($data['remember_me']) ? $data['remember_me'] : false;

    try {
        
        $user = $db->verifyUser($username, $password);

        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            if ($rememberMe) {
                $token = bin2hex(random_bytes(32));
                setcookie('remember_token', $token, time() + 30 * 24 * 60 * 60, '/', '', false, true);

               
            }

            echo json_encode([
                'status' => 'success', 
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}


function logout() {
    session_unset();
    session_destroy();

    if (isset($_COOKIE['remember_token'])) {
        setcookie('remember_token', '', time() - 3600, '/');
    }

    echo json_encode(['status' => 'success', 'message' => 'Logout successful']);
}


    $file = $_FILES['file'];
    $filename = $file['name'];
    $mimeType = $file['type'];
    $size = $file['size'];
    $tmpPath = $file['tmp_name'];


    try {
        $result = $db->saveGroup($userId, $Groupame, $mimeType, $size);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Group uploaded successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save file']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}


function getGroup($db) {
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $files = $db->getUserGroup($userId);

        foreach ($group as &$grp) {
            $grp['size_formatted'] = formatGroupSize($grp['size']);
        }

        echo json_encode(['status' => 'success', 'group' => $group]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

    $userId = $_SESSION['user_id'];

    if (!isset($_GET['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Group ID not provided']);
        return;
    }

    $GroupId = $_GET['id'];

    try {
        
        $file = $db->getGroup($GroupId, $userId);

        if (!$grp) {
            echo json_encode(['status' => 'error', 'message' => 'Group not found']);
            return;
        }

function deleteGroup($db) {
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
        return;
    }

    $userId = $_SESSION['user_id'];

    
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Group ID not provided']);
        return;
    }

    $fileId = $data['id'];

    try {
       
        $result = $db->deleteGroup($GroupId, $userId);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Group deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete Group']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

}
