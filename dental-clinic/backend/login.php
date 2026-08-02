<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['username']) && !empty($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // Hardcoded Admin Credentials check (හෝ Database check එකක්)
    if ($username === 'admin' && $password === 'admin123') {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful!",
            "user" => ["username" => "admin", "role" => "admin"]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid Username or Password!"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Please enter username and password!"
    ]);
}
?>