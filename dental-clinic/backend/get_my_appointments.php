<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$query = isset($_GET['phone']) ? trim($_GET['phone']) : '';

if (!empty($query)) {
    $stmt = $conn->prepare("SELECT * FROM appointments WHERE phone = ? OR booking_code = ? ORDER BY id DESC");
    $stmt->bind_param("ss", $query, $query);
    $stmt->execute();
    $result = $stmt->get_result();

    $appointments = array();
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $appointments]);
} else {
    echo json_encode(["status" => "error", "message" => "Phone number or booking code is required!"]);
}
?>