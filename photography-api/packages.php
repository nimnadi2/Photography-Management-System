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
            $stmt = $conn->prepare("SELECT * FROM packages WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $pkg = $stmt->fetch();
            if (!$pkg) send_error("Package not found", 404);
            send_success($pkg);
        }
        $stmt = $conn->query("SELECT * FROM packages ORDER BY price ASC");
        send_success($stmt->fetchAll());

    case 'POST':
        $body = get_json_body();
        if (empty($body['name'])) send_error("Package name is required", 422);

        $stmt = $conn->prepare("INSERT INTO packages (name, description, price, duration_hours, photo_count) VALUES (:name, :description, :price, :duration, :photos)");
        $stmt->execute([
            ':name' => $body['name'],
            ':description' => $body['description'] ?? null,
            ':price' => $body['price'] ?? 0,
            ':duration' => $body['duration_hours'] ?? 1,
            ':photos' => $body['photo_count'] ?? null,
        ]);
        send_success(["id" => $conn->lastInsertId()], "Package created successfully", 201);

    case 'PUT':
        if (!$id) send_error("Package id is required", 422);
        $body = get_json_body();

        $stmt = $conn->prepare("UPDATE packages SET name=:name, description=:description, price=:price, duration_hours=:duration, photo_count=:photos WHERE id=:id");
        $stmt->execute([
            ':name' => $body['name'] ?? '',
            ':description' => $body['description'] ?? null,
            ':price' => $body['price'] ?? 0,
            ':duration' => $body['duration_hours'] ?? 1,
            ':photos' => $body['photo_count'] ?? null,
            ':id' => $id,
        ]);
        send_success(null, "Package updated successfully");

    case 'DELETE':
        if (!$id) send_error("Package id is required", 422);
        $stmt = $conn->prepare("DELETE FROM packages WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_success(null, "Package deleted successfully");

    default:
        send_error("Method not allowed", 405);
}