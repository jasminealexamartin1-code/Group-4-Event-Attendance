<?php
declare(strict_types=1);

$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://127.0.0.1:5501';
header("Access-Control-Allow-Origin: $origin"); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
header('Content-Type: application/json; charset=utf-8');

const DB_HOST = '127.0.0.1';
const DB_NAME = 'EvenTrackdb';
const DB_USER = 'root';
const DB_PASS = '';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
try {
    $adminCount = db()->query("SELECT COUNT(*) FROM admins")->fetchColumn();

    if ($adminCount == 0) {
        $defaultUser = 'EvenTrackAdmin';
        $defaultPass = password_hash('EvenTrackiacademy123', PASSWORD_DEFAULT); 
        
        $seedStmt = db()->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
        $seedStmt->execute([$defaultUser, $defaultPass]);
    }
} catch (PDOException $e) {
    
}

function json_out(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

function processImageUpload($fileKey) {
    // Check if file was uploaded without errors
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $fileInfo = $_FILES[$fileKey];
    $tmpName = $fileInfo['tmp_name'];
    $fileSize = $fileInfo['size'];
    $fileName = basename($fileInfo['name']);
    
    // img validation: 5MB limit
    $maxSize = 5 * 1024 * 1024; 
    if ($fileSize > $maxSize) return null;

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tmpName);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) return null;

    // Create unique filename and upload path
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $newName = uniqid('event_', true) . '.' . $ext;
    
    $uploadDir = __DIR__ . '/../uploads/'; 
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $destination = $uploadDir . $newName;

    if (move_uploaded_file($tmpName, $destination)) {
        return 'uploads/' . $newName;
    }

    return null;
}

$action = strtolower(trim((string)($_GET['action'] ?? '')));

if ($action === '') {
    json_out(['ok' => false, 'error' => 'Missing action.'], 400);
}

if ($action === 'me') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    if (!empty($_SESSION['admin_id']) && is_numeric($_SESSION['admin_id'])) {
        json_out([
            'ok' => true,
            'username' => (string)($_SESSION['admin_username'] ?? ''),
        ]);
    }

    json_out(['ok' => false]);
}

if ($action === 'logout') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], (bool)$p['secure'], (bool)$p['httponly']);
    }
    session_destroy();
    json_out(['ok' => true]);
}

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $input = read_json_body();
    $login_id = trim((string)($input['login_id'] ?? '')); 
    $password = (string)($input['password'] ?? '');

    if ($login_id === '' || $password === '') {
        json_out(['ok' => false, 'error' => 'Enter your username/email and password.'], 400);
    }

    try {
        $stmt = db()->prepare('SELECT id, username, password FROM admin WHERE username = ? LIMIT 1');
        $stmt->execute([$login_id]);
        $row = $stmt->fetch();
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database error. Check config and that the admin table exists.'], 500);
    }

    if (!$row || !password_verify($password, (string)$row['password'])) {
        json_out(['ok' => false, 'error' => 'Invalid username or password.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int)$row['id'];
    $_SESSION['admin_username'] = (string)$row['username'];

    json_out(['ok' => true, 'username' => (string)$row['username']]);
}

if ($action === 'register') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    if (empty($_SESSION['admin_id'])) {
        json_out(['ok' => false, 'error' => 'Unauthorized. You must be logged in as admin.'], 403);
    }

    $input = read_json_body();
    $email = trim((string)($input['email'] ?? '')); 
    $password = (string)($input['password'] ?? '');
    $confirm = (string)($input['confirmPassword'] ?? '');

    // FORCE IT TO BE AN EMAIL
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_out(['ok' => false, 'error' => 'You must provide a valid email address.'], 400);
    }

    if (strlen($password) < 6) {
        json_out(['ok' => false, 'error' => 'Password must be at least 6 characters.'], 400);
    }

    if ($password !== $confirm) {
        json_out(['ok' => false, 'error' => 'Passwords do not match.'], 400);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = db()->prepare('INSERT INTO admin (username, password) VALUES (?, ?)');
        $stmt->execute([$email, $hash]);
        json_out(['ok' => true, 'username' => $email]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000' || str_contains($e->getMessage(), 'Duplicate')) {
            json_out(['ok' => false, 'error' => 'That account already has admin access.'], 409);
        }
        json_out(['ok' => false, 'error' => 'Database error. Ensure the admin table exists in EvenTrackdb.'], 500);
    }
}

if ($action === 'get_events') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }
    try {
        $stmt = db()->query('
            SELECT e.*, COUNT(a.id) as attendees 
            FROM events e 
            LEFT JOIN attendees a ON e.id = a.event_id 
            GROUP BY e.id 
            ORDER BY e.id DESC
        ');
        $dbEvents = $stmt->fetchAll();
        json_out(['ok' => true, 'events' => $dbEvents]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database error fetching events.'], 500);
    }
}

if ($action === 'create_event') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $title = trim((string)($_POST['title'] ?? ''));
    $date = trim((string)($_POST['date'] ?? ''));
    $time = trim((string)($_POST['time'] ?? ''));
    $location = trim((string)($_POST['location'] ?? ''));
    $capacity = (int)($_POST['capacity'] ?? 0);
    $description = trim((string)($_POST['description'] ?? ''));

    // Process the new image
    $imageUrl = processImageUpload('event_image');

    $cats = $_POST['category'] ?? [];
    if (!is_array($cats)) $cats = [$cats];
    $category = implode(', ', array_map('trim', $cats));

    $types = $_POST['type'] ?? [];
    if (!is_array($types)) $types = [$types];
    $type = implode(', ', array_map('trim', $types));

    if ($title === '' || $date === '' || $time === '' || $location === '') {
        json_out(['ok' => false, 'error' => 'Title, date, time, and location are required.'], 400);
    }
    if ($category === '' || $type === '') {
        json_out(['ok' => false, 'error' => 'At least one Category and Type must be selected.'], 400);
    }

    try {
        $stmt = db()->prepare('INSERT INTO events (name, description, `date`, `time`, location, category, capacity, status, type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, \'upcoming\', ?, ?)');
                 
        $stmt->execute([$title, $description === '' ? null : $description, $date, $time, $location, $category, $capacity, $type, $imageUrl]);
        $newId = (int)db()->lastInsertId();
                 
        json_out(['ok' => true, 'event' => [
            'id' => $newId,
            'title' => $title,
            'category' => $category,
            'type' => $type,
            'date' => $date,
            'time' => $time,
            'location' => $location,
            'capacity' => $capacity,
            'description' => $description,
            'image_url' => $imageUrl,
            'attendees' => 0,
            'status' => 'upcoming',
        ]]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

if ($action === 'delete_event') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }
    
    $id = (int)($_POST['id'] ?? 0);
    if (!$id) json_out(['ok' => false, 'error' => 'Invalid event ID.'], 400);

    try {
        $stmt = db()->prepare('DELETE FROM events WHERE id = ?');
        $stmt->execute([$id]);
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

if ($action === 'update_event') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $id = (int)($_POST['id'] ?? 0);
    $title = trim((string)($_POST['title'] ?? ''));
    $date = trim((string)($_POST['date'] ?? ''));
    $time = trim((string)($_POST['time'] ?? ''));
    $location = trim((string)($_POST['location'] ?? ''));
    $capacity = (int)($_POST['capacity'] ?? 0);
    $description = trim((string)($_POST['description'] ?? ''));

    $newImageUrl = processImageUpload('event_image');

    $cats = $_POST['category'] ?? [];
    if (!is_array($cats)) $cats = [$cats];
    $category = implode(', ', array_map('trim', $cats));

    $types = $_POST['type'] ?? [];
    if (!is_array($types)) $types = [$types];
    $type = implode(', ', array_map('trim', $types));

    if (!$id || $title === '' || $date === '' || $time === '' || $location === '') {
        json_out(['ok' => false, 'error' => 'ID, Title, date, time, and location are required.'], 400);
    }

    try {
        if ($newImageUrl) {
            // New photo uploaded: Update capacity AND image_url
            $stmt = db()->prepare('UPDATE events SET name=?, description=?, `date`=?, `time`=?, location=?, category=?, capacity=?, type=?, image_url=? WHERE id=?');
            $stmt->execute([$title, $description === '' ? null : $description, $date, $time, $location, $category, $capacity, $type, $newImageUrl, $id]);
        } else {
            // No new photo: Update capacity, ignore image_url
            $stmt = db()->prepare('UPDATE events SET name=?, description=?, `date`=?, `time`=?, location=?, category=?, capacity=?, type=? WHERE id=?');
            $stmt->execute([$title, $description === '' ? null : $description, $date, $time, $location, $category, $capacity, $type, $id]);
        }
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

// stop button
if ($action === 'update_event_status') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    // Security: Only logged-in admins can stop an event
    if (empty($_SESSION['admin_id'])) {
        json_out(['ok' => false, 'error' => 'Unauthorized. You must be logged in.'], 403);
    }

    $id = (int)($_POST['id'] ?? 0);
    $status = trim((string)($_POST['status'] ?? ''));

    if (!$id || !in_array($status, ['upcoming', 'live', 'past'])) {
        json_out(['ok' => false, 'error' => 'Invalid ID or status.'], 400);
    }

    try {
        $stmt = db()->prepare('UPDATE events SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

// --- GET LIST OF ADMINS ---
if ($action === 'get_admins') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }
    if (empty($_SESSION['admin_id'])) {
        json_out(['ok' => false, 'error' => 'Unauthorized'], 403);
    }

    try {
        $stmt = db()->query('SELECT id, username FROM admin ORDER BY id ASC');
        $admins = $stmt->fetchAll();
        json_out(['ok' => true, 'admins' => $admins]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database error fetching admins.'], 500);
    }
}

// delete admin 
if ($action === 'delete_admin') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    if (empty($_SESSION['admin_id'])) {
        json_out(['ok' => false, 'error' => 'Unauthorized'], 403);
    }

    $id = (int)($_POST['id'] ?? 0);
    
    if (!$id) {
        json_out(['ok' => false, 'error' => 'Invalid Admin ID.'], 400);
    }

    // Safety checks
    if ($id === (int)$_SESSION['admin_id']) {
        json_out(['ok' => false, 'error' => 'You cannot delete your own account!'], 400);
    }
    if ($id === 1) { // Assuming ID 1 is Superadmin
        json_out(['ok' => false, 'error' => 'You cannot delete the Master Admin account.'], 403);
    }

    try {
        $stmt = db()->prepare('DELETE FROM admin WHERE id = ?');
        $stmt->execute([$id]);
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

if ($action === 'register_attendee') {
    
    $eventId = $_POST['event_id'] ?? '';
    $firstName = trim((string)($_POST['first_name'] ?? ''));
    $lastName = trim((string)($_POST['last_name'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));
    $section = trim((string)($_POST['section'] ?? ''));
    $yearLevel = trim((string)($_POST['year_level'] ?? ''));
    $attendanceType = trim((string)($_POST['attendance_type'] ?? 'walkin'));

    if (empty($eventId) || empty($firstName) || empty($lastName) || empty($email) || empty($section) || empty($yearLevel)) {
        echo json_encode(["ok" => false, "error" => "All fields are required."]);
        exit;
    }

    $category = 'College'; // Default to College
    if (str_contains(strtolower($yearLevel), 'grade')) {
        $category = 'SHS'; // If 'grade 11' or 'grade 12', switch to SHS
    }

    // iacad email only validation
    if (!preg_match('/@iacademy\.edu\.ph$/i', $email)) {
        echo json_encode(["ok" => false, "error" => "Registration restricted: You must use a valid @iacademy.edu.ph email address."]);
        exit;
    }

    try {
        // duplicate emails validation
        $dupStmt = db()->prepare("SELECT id FROM attendees WHERE email = ? AND event_id = ?");
        $dupStmt->execute([$email, $eventId]);
        if ($dupStmt->rowCount() > 0) {
            echo json_encode(["ok" => false, "error" => "You are already registered for this event!"]);
            exit;
        }

        // event capacity validation (doesnt accept more attendees than the event's capacity)
        $capStmt = db()->prepare("
            SELECT capacity, 
            (SELECT COUNT(*) FROM attendees WHERE event_id = ?) as current_count 
            FROM events WHERE id = ?
        ");
        $capStmt->execute([$eventId, $eventId]);
        $eventData = $capStmt->fetch(PDO::FETCH_ASSOC);

        if (!$eventData) {
            echo json_encode(["ok" => false, "error" => "Event not found."]);
            exit;
        }

        if ($eventData['current_count'] >= $eventData['capacity']) {
            echo json_encode(["ok" => false, "error" => "Registration Closed: This event has reached its maximum capacity."]);
            exit;
        }

        $stmt = db()->prepare("INSERT INTO attendees (event_id, first_name, last_name, email, section, year_level, category, attendance_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$eventId, $firstName, $lastName, $email, $section, $yearLevel, $category, $attendanceType]);

        echo json_encode(["ok" => true]);

    } catch (PDOException $e) {
        echo json_encode(["ok" => false, "error" => "Database error: " . $e->getMessage()]);
    }
    exit;
}

// --- GET ATTENDEES FOR A SPECIFIC EVENT ---
if ($action === 'get_event_attendees') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }
    
    $event_id = (int)($_GET['event_id'] ?? 0);
    if (!$event_id) json_out(['ok' => false, 'error' => 'Invalid Event ID.'], 400);

    try {
        // Fetch all students registered for this specific event
        $stmt = db()->prepare('SELECT * FROM attendees WHERE event_id = ? ORDER BY id DESC');
        $stmt->execute([$event_id]);
        $attendees = $stmt->fetchAll();
        
        $stmt2 = db()->prepare('SELECT * FROM events WHERE id = ?');
        $stmt2->execute([$event_id]);
        $event = $stmt2->fetch();

        json_out(['ok' => true, 'attendees' => $attendees, 'event' => $event]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

// --- TOGGLE ATTENDANCE (Mark Present / Absent) ---
if ($action === 'toggle_attendance') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $id = (int)($_POST['id'] ?? 0);
    $status = (int)($_POST['status'] ?? 0); // 1 for Present, 0 for Absent
    
    if (!$id) json_out(['ok' => false, 'error' => 'Invalid Attendee ID.'], 400);

    try {
        $stmt = db()->prepare('UPDATE attendees SET attended = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}

// --- DELETE ATTENDEE ---
if ($action === 'delete_attendee') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }

    $id = (int)($_POST['id'] ?? 0);
    if (!$id) json_out(['ok' => false, 'error' => 'Invalid Attendee ID.'], 400);

    try {
        $stmt = db()->prepare('DELETE FROM attendees WHERE id = ?');
        $stmt->execute([$id]);
        json_out(['ok' => true]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()], 500);
    }
}


//recent registrations 

if ($action === 'get_recent_attendees') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
    }
    try {
        $stmt = db()->query('SELECT a.first_name, a.last_name, a.attended, a.attendance_type, e.name as event_name, e.event_title FROM attendees a JOIN events e ON a.event_id = e.id ORDER BY a.id DESC LIMIT 4');
        $attendees = $stmt->fetchAll();
        json_out(['ok' => true, 'attendees' => $attendees]);
    } catch (PDOException $e) {
        json_out(['ok' => false, 'error' => 'Database error.'], 500);
    }
}
json_out(['ok' => false, 'error' => 'Unknown action.'], 404);

