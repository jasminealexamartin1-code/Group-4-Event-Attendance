<?php
// ── scan.php — QR Code Scanner Handler ───────────────────────────────
// When admin scans the QR code, this page marks the attendee as present

declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'EvenTrackdb';
const DB_USER = 'root';
const DB_PASS = '';

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

$id = (int)($_GET['id'] ?? 0);

if (!$id) {
    showPage('error', 'Invalid QR Code', 'This QR code is not valid.');
    exit;
}

try {
    // Fetch attendee
    $stmt = db()->prepare('SELECT a.*, e.name as event_name FROM attendees a JOIN events e ON a.event_id = e.id WHERE a.id = ?');
    $stmt->execute([$id]);
    $attendee = $stmt->fetch();

    if (!$attendee) {
        showPage('error', 'Not Found', 'This attendee was not found in the system.');
        exit;
    }

    if ($attendee['attended'] == 1) {
        // Already marked present
        showPage('already', 'Already Checked In', '', $attendee);
        exit;
    }

    // Mark as present
    $update = db()->prepare('UPDATE attendees SET attended = 1 WHERE id = ?');
    $update->execute([$id]);

    showPage('success', 'Check-in Successful!', '', $attendee);

} catch (PDOException $e) {
    showPage('error', 'Database Error', $e->getMessage());
}

function showPage(string $type, string $title, string $message, array $attendee = []): void
{
    $icons    = ['success' => '✅', 'already' => '⚠️', 'error' => '❌'];
    $colors   = ['success' => '#2e7d32', 'already' => '#e65100', 'error' => '#c62828'];
    $bgColors = ['success' => '#e8f5e9', 'already' => '#fff3e0', 'error' => '#ffebee'];

    $icon    = $icons[$type]    ?? '❓';
    $color   = $colors[$type]   ?? '#333';
    $bgColor = $bgColors[$type] ?? '#f5f5f5';

    $name      = isset($attendee['first_name']) ? htmlspecialchars($attendee['first_name'] . ' ' . $attendee['last_name']) : '';
    $section   = htmlspecialchars($attendee['section']    ?? '');
    $yearLevel = htmlspecialchars($attendee['year_level'] ?? '');
    $eventName = htmlspecialchars($attendee['event_name'] ?? '');
    $email     = htmlspecialchars($attendee['email']      ?? '');

    $detailsHtml = '';
    if ($attendee) {
        $detailsHtml = <<<HTML
        <div style="background:#fff;border-radius:12px;padding:20px;margin-top:20px;text-align:left;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="margin-bottom:10px;">
                <span style="color:#8492a6;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Student</span><br/>
                <span style="color:#0a2463;font-weight:700;font-size:1rem;">{$name}</span>
            </div>
            <div style="margin-bottom:10px;">
                <span style="color:#8492a6;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Email</span><br/>
                <span style="color:#2d3748;font-size:0.9rem;">{$email}</span>
            </div>
            <div style="margin-bottom:10px;">
                <span style="color:#8492a6;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Section</span><br/>
                <span style="color:#2d3748;font-size:0.9rem;">{$section}</span>
            </div>
            <div style="margin-bottom:10px;">
                <span style="color:#8492a6;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Year Level</span><br/>
                <span style="color:#2d3748;font-size:0.9rem;">{$yearLevel}</span>
            </div>
            <div>
                <span style="color:#8492a6;font-size:0.75rem;font-weight:700;text-transform:uppercase;">Event</span><br/>
                <span style="color:#2d3748;font-size:0.9rem;">{$eventName}</span>
            </div>
        </div>
HTML;
    }

    $subtitle = match($type) {
        'success' => 'Student has been marked as <strong>Present</strong>.',
        'already' => 'This student was <strong>already checked in</strong>.',
        default   => htmlspecialchars($message),
    };

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{$title} — EvenTrack</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background: #f0f4f8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(10,36,99,0.12);
      padding: 40px 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .banner {
      background: {$bgColor};
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .icon { font-size: 3rem; margin-bottom: 12px; }
    .title { color: {$color}; font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; }
    .subtitle { color: #4a5568; font-size: 0.9rem; line-height: 1.5; }
    .brand { color: #0a2463; font-weight: 900; font-size: 1.1rem; margin-bottom: 24px; }
    .time { color: #8492a6; font-size: 0.8rem; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">● EvenTrack</div>
    <div class="banner">
      <div class="icon">{$icon}</div>
      <div class="title">{$title}</div>
      <div class="subtitle">{$subtitle}</div>
    </div>
    {$detailsHtml}
  </div>
</body>
</html>
HTML;
}