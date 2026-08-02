<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id']) && !empty($data['name']) && !empty($data['specialty']) && !empty($data['experience'])) {
    $id = $data['id'];
    $name = $data['name'];
    $specialty = $data['specialty'];
    $experience = $data['experience'];
    $photo_emoji = !empty($data['photo_emoji']) ? $data['photo_emoji'] : '🦷';

    $stmt = $conn->prepare("UPDATE doctors SET name = ?, specialty = ?, experience = ?, photo_emoji = ? WHERE id = ?");
    $stmt->bind_param("ssssi", $name, $specialty, $experience, $photo_emoji, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Doctor updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "DB Error: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Please fill all fields!"]);
}

$conn->close();
?>