<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

$database = new Database();
$conn = $database->connect();
$user = require_auth($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_error("Method not allowed", 405);
}

$stats = [];

$stats['total_clients'] = (int) $conn->query("SELECT COUNT(*) c FROM clients")->fetch()['c'];
$stats['total_bookings'] = (int) $conn->query("SELECT COUNT(*) c FROM bookings")->fetch()['c'];
$stats['upcoming_bookings'] = (int) $conn->query("SELECT COUNT(*) c FROM bookings WHERE event_date >= NOW() AND status != 'cancelled'")->fetch()['c'];
$stats['total_revenue'] = (float) $conn->query("SELECT COALESCE(SUM(amount),0) s FROM invoices WHERE status = 'paid'")->fetch()['s'];
$stats['pending_revenue'] = (float) $conn->query("SELECT COALESCE(SUM(amount),0) s FROM invoices WHERE status != 'paid'")->fetch()['s'];
$stats['total_galleries'] = (int) $conn->query("SELECT COUNT(*) c FROM galleries")->fetch()['c'];
$stats['total_photos'] = (int) $conn->query("SELECT COUNT(*) c FROM gallery_photos")->fetch()['c'];

$stats['bookings_by_status'] = $conn->query(
    "SELECT status, COUNT(*) AS total FROM bookings GROUP BY status"
)->fetchAll();

$stats['revenue_last_6_months'] = $conn->query(
    "SELECT DATE_FORMAT(issued_date, '%Y-%m') AS month, COALESCE(SUM(amount),0) AS total
     FROM invoices
     WHERE status = 'paid' AND issued_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
     GROUP BY month ORDER BY month ASC"
)->fetchAll();

$stats['upcoming'] = $conn->query(
    "SELECT b.id, b.title, b.event_date, b.status, c.name AS client_name
     FROM bookings b JOIN clients c ON c.id = b.client_id
     WHERE b.event_date >= NOW() AND b.status != 'cancelled'
     ORDER BY b.event_date ASC LIMIT 5"
)->fetchAll();

$stats['recent_invoices'] = $conn->query(
    "SELECT i.id, i.invoice_number, i.amount, i.status, i.due_date, c.name AS client_name
     FROM invoices i JOIN bookings b ON b.id = i.booking_id JOIN clients c ON c.id = b.client_id
     ORDER BY i.created_at DESC LIMIT 5"
)->fetchAll();

send_success($stats);