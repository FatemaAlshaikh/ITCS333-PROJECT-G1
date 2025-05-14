<?php
class DatabaseHelper {
    private $pdo;
    // Constructor: establishes a connection to the database using PDO
    public function __construct($host, $dbname, $username, $password, $options = []) {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

        // Default PDO options for error handling and fetch mode
        $defaultOptions = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        // Merge user-provided options with defaults
        $options = array_replace($defaultOptions, $options);
        // Create a new PDO instance
        $this->pdo = new PDO($dsn, $username, $password, $options);
    }
    // Register a new attendee for a specific event
    public function registerAttendee($name, $email, $phone, $eventId, $comments) {
        $sql = "INSERT INTO attendees (name, email, phone, event_id, comments) 
                VALUES (:name, :email, :phone, :event_id, :comments)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':event_id' => $eventId,
            ':comments' => $comments
        ]);
    }
    // Create a new event
    public function createEvent($name, $date, $time, $type, $contact, $imagePath, $description) {
        $sql = "INSERT INTO events (name, date, time, type, contact, image, description) 
                VALUES (:name, :date, :time, :type, :contact, :image, :description)";
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
    // Get a list of events with optional filtering by type and/or date
    public function getAllEvents($limit = 10, $offset = 0, $type = null, $date = null) {
        $sql = "SELECT * FROM events WHERE 1=1";
        $params = [];
        // Add type filter if provided
        if ($type) {
            $sql .= " AND type = :type";
            $params[':type'] = $type;
        }
        // Add date filter if provided
        if ($date) {
            $sql .= " AND date = :date";
            $params[':date'] = $date;
        }
        // (Optional redundancy: already handled above)
        if ($type && $date) {
            $sql .= " AND type = :type AND date = :date"; // This line is redundant
        }
        // Add pagination and sorting
        $sql .= " ORDER BY date DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($sql);
        // Bind limit and offset as integers
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        // Bind filters if available
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }
    // Get a single event by its ID
    public function getEventById($id) {
        $sql = "SELECT * FROM events WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }
    // Update an existing event (excluding image)
    public function updateEvent($id, $name, $date, $time, $type, $contact, $description) {
        $sql = "UPDATE events 
                SET name = :name, date = :date, time = :time, type = :type, contact = :contact, description = :description 
                WHERE id = :id";
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
    // Delete an event by its ID
    public function deleteEvent($id) {
        $sql = "DELETE FROM events WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
    }
    // Search events by keyword in name or description
    public function searchEvents($keyword) {
        $sql = "SELECT * FROM events 
                WHERE name LIKE :keyword OR description LIKE :keyword";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':keyword' => '%' . $keyword . '%']);
        return $stmt->fetchAll();
    }
    // Get all attendees registered for a specific event
    public function getAttendeesByEvent($eventId) {
        $sql = "SELECT * FROM attendees WHERE event_id = :event_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':event_id' => $eventId]);
        return $stmt->fetchAll();
    }
}
?>
