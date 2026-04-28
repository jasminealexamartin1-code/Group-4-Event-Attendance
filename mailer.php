<?php
// ── EvenTrack Mailer ──────────────────────────────────────────────────
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';

const MAIL_FROM     = 'eventrack.noreply@gmail.com';
const MAIL_FROM_NAME = 'EvenTrack';
const MAIL_PASSWORD = 'gwvtsuqsuyiyxzzy';

// Base URL for QR scan link
const BASE_URL = 'http://127.0.0.1/EvenTrack';

function sendConfirmationEmail(array $attendee, array $event): bool
{
    // Generate QR code URL using free QR API
    $scanUrl = BASE_URL . '/php/scan.php?id=' . $attendee['id'];
    $qrUrl   = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($scanUrl);

    $mail = new PHPMailer(true);

    try {
        // SMTP config
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = MAIL_FROM;
        $mail->Password   = MAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        $mail->addAddress($attendee['email'], $attendee['first_name'] . ' ' . $attendee['last_name']);

        // Content
        $mail->isHTML(true);
        $mail->Subject = '✅ Registration Confirmed — ' . $event['name'];
        $mail->Body    = buildEmailHTML($attendee, $event, $qrUrl, $scanUrl);
        $mail->AltBody = buildEmailText($attendee, $event, $scanUrl);

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Mailer error: ' . $mail->ErrorInfo);
        return false;
    }
}

function buildEmailHTML(array $a, array $e, string $qrUrl, string $scanUrl): string
{
    $name      = htmlspecialchars($a['first_name'] . ' ' . $a['last_name']);
    $email     = htmlspecialchars($a['email']);
    $section   = htmlspecialchars($a['section']);
    $yearLevel = htmlspecialchars($a['year_level']);
    $type      = ucfirst($a['attendance_type'] ?? 'walkin');
    $eventName = htmlspecialchars($e['name']);
    $date      = htmlspecialchars($e['date'] ?? 'TBA');
    $location  = htmlspecialchars($e['location'] ?? 'TBA');

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#0a2463;padding:32px 40px;text-align:center;">
              <div style="font-size:1.5rem;font-weight:900;color:#ffffff;letter-spacing:1px;">● EvenTrack</div>
              <div style="color:#a0b4d6;font-size:0.9rem;margin-top:6px;">Event Attendance System</div>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="background:#e8f5e9;padding:24px 40px;text-align:center;border-bottom:2px solid #c8e6c9;">
              <div style="font-size:2.5rem;">✅</div>
              <h1 style="color:#2e7d32;font-size:1.4rem;margin:8px 0 4px;">Registration Confirmed!</h1>
              <p style="color:#388e3c;margin:0;font-size:0.9rem;">You're all set for <strong>{$eventName}</strong></p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#2d3748;font-size:0.95rem;">Hi <strong>{$name}</strong>,</p>
              <p style="color:#4a5568;font-size:0.9rem;line-height:1.6;">
                Your registration has been confirmed. Below is a summary of your registration details and your QR code for event check-in.
              </p>

              <!-- Event Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:12px;padding:20px;margin:20px 0;">
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:#8492a6;font-size:0.8rem;font-weight:700;text-transform:uppercase;">Event</span><br/>
                  <span style="color:#0a2463;font-weight:700;font-size:1rem;">{$eventName}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:#8492a6;font-size:0.8rem;font-weight:700;text-transform:uppercase;">Date</span><br/>
                  <span style="color:#2d3748;font-size:0.95rem;">{$date}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:#8492a6;font-size:0.8rem;font-weight:700;text-transform:uppercase;">Location</span><br/>
                  <span style="color:#2d3748;font-size:0.95rem;">{$location}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                  <span style="color:#8492a6;font-size:0.8rem;font-weight:700;text-transform:uppercase;">Attendance Type</span><br/>
                  <span style="color:#2d3748;font-size:0.95rem;">{$type}</span>
                </td></tr>
              </table>

              <!-- Registrant Details -->
              <h3 style="color:#0a2463;font-size:0.95rem;margin:24px 0 12px;">Your Information</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:12px;padding:20px;">
                <tr><td style="padding:6px 0;">
                  <span style="color:#8492a6;font-size:0.8rem;">Name:</span>
                  <span style="color:#2d3748;font-size:0.9rem;margin-left:8px;font-weight:600;">{$name}</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#8492a6;font-size:0.8rem;">Email:</span>
                  <span style="color:#2d3748;font-size:0.9rem;margin-left:8px;">{$email}</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#8492a6;font-size:0.8rem;">Section:</span>
                  <span style="color:#2d3748;font-size:0.9rem;margin-left:8px;">{$section}</span>
                </td></tr>
                <tr><td style="padding:6px 0;">
                  <span style="color:#8492a6;font-size:0.8rem;">Year Level:</span>
                  <span style="color:#2d3748;font-size:0.9rem;margin-left:8px;">{$yearLevel}</span>
                </td></tr>
              </table>

              <!-- QR Code -->
              <div style="text-align:center;margin:32px 0 16px;">
                <h3 style="color:#0a2463;margin-bottom:8px;">Your Check-in QR Code</h3>
                <p style="color:#4a5568;font-size:0.85rem;margin-bottom:16px;">
                  Show this QR code at the event entrance to be marked present automatically.
                </p>
                <img src="{$qrUrl}" alt="QR Code" width="200" height="200" style="border:4px solid #0a2463;border-radius:12px;"/>
                <p style="color:#8492a6;font-size:0.75rem;margin-top:8px;">
                  Or visit: <a href="{$scanUrl}" style="color:#0a2463;">{$scanUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8faff;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#8492a6;font-size:0.78rem;margin:0;">
                This is an automated confirmation from EvenTrack. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

function buildEmailText(array $a, array $e, string $scanUrl): string
{
    return "Registration Confirmed!\n\n"
        . "Hi {$a['first_name']},\n\n"
        . "Event: {$e['name']}\n"
        . "Date: {$e['date']}\n"
        . "Location: {$e['location']}\n"
        . "Type: {$a['attendance_type']}\n\n"
        . "Your Info:\n"
        . "Name: {$a['first_name']} {$a['last_name']}\n"
        . "Email: {$a['email']}\n"
        . "Section: {$a['section']}\n"
        . "Year Level: {$a['year_level']}\n\n"
        . "Check-in link: {$scanUrl}\n\n"
        . "— EvenTrack";
}