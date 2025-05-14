<?php
require_once 'config.php';

class DatabaseHelper {
    private $host;
    private $dbName;
    private $username;
    private $password;
    private $options;
    private $pdo;

    public function __construct($host, $dbName, $username, $password, $options = []) {
        $this->host = $host;
        $this->dbName = $dbName;
        $this->username = $username;
        $this->password = $password;
        $this->options = $options;
    }

    
    public function getPDO() {
        if (!$this->pdo) {
            try {
                
                $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
                $this->pdo = new PDO($dsn, $this->username, $this->password, $this->options);
            } catch (PDOException $e) {
                
                if ($e->getCode() == 1049) {
                    $this->createDatabase();
                    
                    $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
                    $this->pdo = new PDO($dsn, $this->username, $this->password, $this->options);
                } else {
                    throw $e;
                }
            }
        }
        return $this->pdo;
    }

    
    private function createDatabase() {
        try {
            $pdo = new PDO("mysql:host={$this->host}", $this->username, $this->password, $this->options);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$this->dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            die("Error creating database: " . $e->getMessage());
        }
    }

    
    public function query($sql) {
        return $this->getPDO()->query($sql);
    }

    
    public function prepare($sql) {
        return $this->getPDO()->prepare($sql);
    }

    
    public function exec($sql) {
        return $this->getPDO()->exec($sql);
    }

    
    public function createUsersTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password` VARCHAR(255) NOT NULL,
            `email` VARCHAR(100) NOT NULL UNIQUE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $this->exec($sql);
    }

    
    public function createGroupTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `group` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `GroupName` VARCHAR(255) NOT NULL,
            `mime_type` VARCHAR(100) NOT NULL,
            `size` INT NOT NULL,
            `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $this->exec($sql);
    }

    
    public function registerUser($username, $password, $email) {
        
        $this->createUsersTable();

        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $this->prepare("INSERT INTO `users` (`username`, `password`, `email`) VALUES (?, ?, ?)");
        return $stmt->execute([$username, $hashedPassword, $email]);
    }

    
    public function verifyUser($username, $password) {
        $stmt = $this->prepare("SELECT * FROM `users` WHERE `username` = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }

        return false;
    }

    
    public function saveGroup($userId, $GroupName, $mimeType, $size) {
       
        $this->createGroupTable();

        
        $stmt = $this->prepare("INSERT INTO `group` (`user_id`, `GroupName`, `mime_type`, `size`) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$userId, $GroupName, $mimeType, $size);
    }

    public function getUserGroup($userId) {
        $stmt = $this->prepare("SELECT `id`, `filename`, `mime_type`, `size`, `uploaded_at` FROM `files` WHERE `user_id` = ? ORDER BY `uploaded_at` DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }


    public function getGroup($GroupId, $userId) {
        $stmt = $this->prepare("SELECT * FROM `files` WHERE `id` = ? AND `user_id` = ?");
        $stmt->execute([$GroupId, $userId]);
        return $stmt->fetch();
    }

    public function deleteGroup($GroupId, $userId) {
        $stmt = $this->prepare("DELETE FROM `group` WHERE `id` = ? AND `user_id` = ?");
        return $stmt->execute([$GroupId, $userId]);
    }
}