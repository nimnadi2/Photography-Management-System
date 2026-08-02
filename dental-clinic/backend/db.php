<?php
$host = "localhost";
$user = "root";
$password = "root123"; 
$dbname = "dental_clinic"; // HeidiSQL එකේ තියෙන ඩේටාබේස් නමම දෙන්න

// Database Connection එක සෑදීම
$conn = new mysqli($host, $user, $password, $dbname);

// Connection එක සාර්ථකදැයි පරීක්ෂා කිරීම
if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "error", 
        "message" => "Database Connection Failed: " . $conn->connect_error
    ]);
    exit();
}

// සිංහල අකුරු/දත්ත අවුලක් නැතුව සේව් වෙන්න මේ පේළිය දාන්න
$conn->set_charset("utf8mb4");
?>