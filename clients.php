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

switch ($method) {

    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM clients WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $client = $stmt->fetch();
            if (!$client) send_error("Client not found", 404);

            $bookings = $conn->prepare("SELECT id, title, event_date, status, amount FROM bookings WHERE client_id = :id ORDER BY event_date DESC");
            $bookings->execute([':id' => $id]);
            $client['bookings'] = $bookings->fetchAll();

            send_success($client);
        }

        $search = $_GET['search'] ?? '';
        $sql = "SELECT c.*,
                    (SELECT COUNT(*) FROM bookings b WHERE b.client_id = c.id) AS booking_count
                FROM clients c";
        $params = [];
        if ($search) {
            $sql .= " WHERE c.name LIKE :search OR c.email LIKE :search OR c.phone LIKE :search";
            $params[':search'] = "%$search%";
        }
        $sql .= " ORDER BY c.created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        send_success($stmt->fetchAll());

    case 'POST':
        $body = get_json_body();
        if (empty($body['name'])) send_error("Client name is required", 422);

        $stmt = $conn->prepare("INSERT INTO clients (name, email, phone, address, notes) VALUES (:name, :email, :phone, :address, :notes)");
        $stmt->execute([
            ':name' => $body['name'],
            ':email' => $body['email'] ?? null,
            ':phone' => $body['phone'] ?? null,
            ':address' => $body['address'] ?? null,
            ':notes' => $body['notes'] ?? null,
        ]);
        send_success(["id" => $conn->lastInsertId()], "Client added successfully", 201);

    case 'PUT':
        if (!$id) send_error("Client id is required", 422);
        $body = get_json_body();

        $stmt = $conn->prepare("UPDATE clients SET name=:name, email=:email, phone=:phone, address=:address, notes=:notes WHERE id=:id");
        $stmt->execute([
            ':name' => $body['name'] ?? '',
            ':email' => $body['email'] ?? null,
            ':phone' => $body['phone'] ?? null,
            ':address' => $body['address'] ?? null,
            ':notes' => $body['notes'] ?? null,
            ':id' => $id,
        ]);
        send_success(null, "Client updated successfully");

    case 'DELETE':
        if (!$id) send_error("Client id is required", 422);
        $stmt = $conn->prepare("DELETE FROM clients WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_success(null, "Client deleted successfully");

    default:
        send_error("Method not allowed", 405);
}