<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['patient_name']) && !empty($data['phone']) && !empty($data['service']) && !empty($data['date']) && !empty($data['time'])) {
    $name = $data['patient_name'];
    $phone = $data['phone'];
    $service = $data['service'];
    $doctor = !empty($data['doctor_name']) ? $data['doctor_name'] : null;
    $date = $data['date'];
    $time = $data['time'];

    // Generate a unique booking code, e.g. DC-7X9K2P
    function generateBookingCode($conn) {
        do {
            $code = 'DC-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
            $check = $conn->prepare("SELECT id FROM appointments WHERE booking_code = ?");
            $check->bind_param("s", $code);
            $check->execute();
            $exists = $check->get_result()->num_rows > 0;
            $check->close();
        } while ($exists);
        return $code;
    }

    $bookingCode = generateBookingCode($conn);

    $stmt = $conn->prepare("INSERT INTO appointments (booking_code, patient_name, phone, service, doctor_name, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt) {
        $stmt->bind_param("sssssss", $bookingCode, $name, $phone, $service, $doctor, $date, $time);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Appointment booked successfully!",
                "booking_code" => $bookingCode
            ]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "DB Execution Error: " . $stmt->error]);
            exit;
        }
    } else {
        echo json_encode(["status" => "error", "message" => "DB Prepare Error: " . $conn->error]);
        exit;
    }
} else {
    echo json_encode(["status" => "error", "message" => "Please fill all fields!"]);
    exit;
}