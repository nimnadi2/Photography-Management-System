<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

$database = new Database();
$conn = $database->connect();
$user = require_auth($conn);

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

$baseSelect = "SELECT b.*, c.name AS client_name, c.email AS client_email, c.phone AS client_phone,
                      p.name AS package_name
               FROM bookings b
               JOIN clients c ON c.id = b.client_id
               LEFT JOIN packages p ON p.id = b.package_id";

switch ($method) {

    case 'GET':
        if ($id) {
            $stmt = $conn->prepare($baseSelect . " WHERE b.id = :id");
            $stmt->execute([':id' => $id]);
            $booking = $stmt->fetch();
            if (!$booking) send_error("Booking not found", 404);

            $gal = $conn->prepare("SELECT id, title FROM galleries WHERE booking_id = :id");
            $gal->execute([':id' => $id]);
            $booking['galleries'] = $gal->fetchAll();

            send_success($booking);
        }

        $status = $_GET['status'] ?? '';
        $sql = $baseSelect;
        $params = [];
        if ($status) {
            $sql .= " WHERE b.status = :status";
            $params[':status'] = $status;
        }
        $sql .= " ORDER BY b.event_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        send_success($stmt->fetchAll());

    case 'POST':
        $body = get_json_body();
        foreach (['client_id', 'title', 'event_date'] as $field) {
            if (empty($body[$field])) send_error("Field '$field' is required", 422);
        }

        $stmt = $conn->prepare("INSERT INTO bookings
            (client_id, package_id, title, shoot_type, event_date, location, status, amount, notes)
            VALUES (:client_id, :package_id, :title, :shoot_type, :event_date, :location, :status, :amount, :notes)");
        $stmt->execute([
            ':client_id' => $body['client_id'],
            ':package_id' => $body['package_id'] ?: null,
            ':title' => $body['title'],
            ':shoot_type' => $body['shoot_type'] ?: null,
            ':event_date' => $body['event_date'],
            ':location' => $body['location'] ?: null,
            ':status' => $body['status'] ?: 'pending',
            ':amount' => $body['amount'] ?: 0,
            ':notes' => $body['notes'] ?: null,
        ]);
        send_success(["id" => $conn->lastInsertId()], "Booking created successfully", 201);

    case 'PUT':
        if (!$id) send_error("Booking id is required", 422);
        $body = get_json_body();

        $stmt = $conn->prepare("UPDATE bookings SET
            client_id=:client_id, package_id=:package_id, title=:title, shoot_type=:shoot_type,
            event_date=:event_date, location=:location, status=:status, amount=:amount, notes=:notes
            WHERE id=:id");
        $stmt->execute([
            ':client_id' => $body['client_id'],
            ':package_id' => $body['package_id'] ?: null,
            ':title' => $body['title'],
            ':shoot_type' => $body['shoot_type'] ?: null,
            ':event_date' => $body['event_date'],
            ':location' => $body['location'] ?: null,
            ':status' => $body['status'] ?: 'pending',
            ':amount' => $body['amount'] ?: 0,
            ':notes' => $body['notes'] ?: null,
            ':id' => $id,
        ]);
        send_success(null, "Booking updated successfully");

    case 'DELETE':
        if (!$id) send_error("Booking id is required", 422);
        $stmt = $conn->prepare("DELETE FROM bookings WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_success(null, "Booking deleted successfully");

    default:
        send_error("Method not allowed", 405);
}