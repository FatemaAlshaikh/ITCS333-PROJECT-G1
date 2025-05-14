<?php
class Database {
    private $host = "localhost";
    private $db_name = "mydb";
    private $username = "user1";
    private $password = "abcd1234";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" .
                $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8mb4");
        } catch (PDOException $exception) {
            echo json_encode(["error" => "Connection failed: " . $exception->getMessage()]);
        }
        return $this->conn;
    }
}
?>
