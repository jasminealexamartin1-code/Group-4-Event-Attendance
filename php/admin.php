<?php
declare(strict_types=1);

header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle the "preflight" request that browsers send before POST requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
header('Content-Type: application/json; charset=utf-8');

/**
 * XAMPP default: MySQL on 127.0.0.1, user root, empty password.
 * Change these if your local MySQL differs.
 */
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
    $username = trim((string)($input['username'] ?? ''));
    $password = (string)($input['password'] ?? '');

    if ($username === '' || $password === '') {
        json_out(['ok' => false, 'error' => 'Enter username and password.'], 400);
    }

    try {
        $stmt = db()->prepare('SELECT id, username, password FROM admin WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
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

    $input = read_json_body();
    $username = trim((string)($input['username'] ?? ''));
    $password = (string)($input['password'] ?? '');
    $confirm = (string)($input['confirmPassword'] ?? '');

    if (strlen($username) < 3) {
        json_out(['ok' => false, 'error' => 'Username must be at least 3 characters.'], 400);
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
        $stmt->execute([$username, $hash]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000' || str_contains($e->getMessage(), 'Duplicate')) {
            json_out(['ok' => false, 'error' => 'That username is already taken.'], 409);
        }
        json_out(['ok' => false, 'error' => 'Database error. Ensure the admin table exists in EvenTrackdb.'], 500);
    }

    $id = (int)db()->lastInsertId();
    session_regenerate_id(true);
    $_SESSION['admin_id'] = $id;
    $_SESSION['admin_username'] = $username;

    json_out(['ok' => true, 'username' => $username]);
}

json_out(['ok' => false, 'error' => 'Unknown action.'], 404);

