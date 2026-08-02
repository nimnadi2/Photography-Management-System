<?php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['name']) && !empty($data['email']) && !empty($data['message'])) {
    $name = $data['name'];
    $email = $data['email'];
    $message = $data['message'];

    // 1. Database එකට Save කිරීම
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");

    if ($stmt) {
        $stmt->bind_param("sss", $name, $email, $message);

        if ($stmt->execute()) {

            // 2. PHPMailer එකෙන් Confirmation Mail එක යැවීම
            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'maleeshanimnadi2@gmail.com';
                $mail->Password   = 'nluscvaekqougxea';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true
                    )
                );

                $mail->setFrom('maleeshanimnadi2@gmail.com', 'Dental Clinic');
                $mail->addAddress('maleeshanimnadi2@gmail.com');

                $mail->isHTML(true);
                $mail->Subject = 'New Contact Message from ' . $name;
                $mail->Body    = "
                    <h2>New Contact Message</h2>
                    <p><b>Name:</b> {$name}</p>
                    <p><b>Email:</b> {$email}</p>
                    <p><b>Message:</b> {$message}</p>
                ";

                $mail->send();
                echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
            } catch (Exception $e) {
                echo json_encode(["success" => true, "message" => "Message saved, but email notification failed."]);
            }

        } else {
            echo json_encode(["success" => false, "message" => "DB Execution Error: " . $stmt->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "DB Prepare Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Please fill all fields!"]);
}
?>