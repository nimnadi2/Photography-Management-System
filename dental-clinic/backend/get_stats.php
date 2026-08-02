<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$stats = [];

$result = $conn->query("SELECT COUNT(*) as total FROM appointments");
$stats['total'] = $result->fetch_assoc()['total'];

$result = $conn->query("SELECT COUNT(*) as pending FROM appointments WHERE status = 'pending'");
$stats['pending'] = $result->fetch_assoc()['pending'];

$result = $conn->query("SELECT COUNT(*) as approved FROM appointments WHERE status = 'approved'");
$stats['approved'] = $result->fetch_assoc()['approved'];

$result = $conn->query("SELECT COUNT(*) as completed FROM appointments WHERE status = 'completed'");
$stats['completed'] = $result->fetch_assoc()['completed'];

$result = $conn->query("SELECT COUNT(*) as cancelled FROM appointments WHERE status = 'cancelled'");
$stats['cancelled'] = $result->fetch_assoc()['cancelled'];

$result = $conn->query("SELECT service, COUNT(*) as count FROM appointments GROUP BY service ORDER BY count DESC LIMIT 5");
$serviceStats = [];
while ($row = $result->fetch_assoc()) {
    $serviceStats[] = $row;
}
$stats['by_service'] = $serviceStats;

$result = $conn->query("SELECT COUNT(*) as today FROM appointments WHERE appointment_date = CURDATE()");
$stats['today'] = $result->fetch_assoc()['today'];

echo json_encode(["status" => "success", "data" => $stats]);
$conn->close();