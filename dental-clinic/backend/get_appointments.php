<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$result = $conn->query("SELECT * FROM appointments ORDER BY appointment_date, appointment_time");

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode(["status" => "success", "data" => $appointments]);
$conn->close();