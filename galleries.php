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
            $stmt = $conn->prepare(
                "SELECT g.*, b.title AS booking_title, b.event_date, c.name AS client_name
                 FROM galleries g
                 JOIN bookings b ON b.id = g.booking_id
                 JOIN clients c ON c.id = b.client_id
                 WHERE g.id = :id"
            );
            $stmt->execute([':id' => $id]);
            $gallery = $stmt->fetch();
            if (!$gallery) send_error("Gallery not found", 404);

            $photos = $conn->prepare("SELECT * FROM gallery_photos WHERE gallery_id = :id ORDER BY is_cover DESC, uploaded_at DESC");
            $photos->execute([':id' => $id]);
            $gallery['photos'] = $photos->fetchAll();

            send_success($gallery);
        }

        $stmt = $conn->query(
            "SELECT g.*, b.title AS booking_title, c.name AS client_name,
                    (SELECT COUNT(*) FROM gallery_photos gp WHERE gp.gallery_id = g.id) AS photo_count,
                    (SELECT filename FROM gallery_photos gp WHERE gp.gallery_id = g.id ORDER BY is_cover DESC, uploaded_at DESC LIMIT 1) AS cover_photo
             FROM galleries g
             JOIN bookings b ON b.id = g.booking_id
             JOIN clients c ON c.id = b.client_id
             ORDER BY g.created_at DESC"
        );
        send_success($stmt->fetchAll());

    case 'POST':
        $body = get_json_body();
        if (empty($body['booking_id']) || empty($body['title'])) {
            send_error("booking_id and title are required", 422);
        }
        $stmt = $conn->prepare("INSERT INTO galleries (booking_id, title, is_public) VALUES (:booking_id, :title, :is_public)");
        $stmt->execute([
            ':booking_id' => $body['booking_id'],
            ':title' => $body['title'],
            ':is_public' => !empty($body['is_public']) ? 1 : 0,
        ]);
        send_success(["id" => $conn->lastInsertId()], "Gallery created successfully", 201);

    case 'PUT':
        if (!$id) send_error("Gallery id is required", 422);
        $body = get_json_body();
        $stmt = $conn->prepare("UPDATE galleries SET title=:title, is_public=:is_public WHERE id=:id");
        $stmt->execute([
            ':title' => $body['title'] ?? '',
            ':is_public' => !empty($body['is_public']) ? 1 : 0,
            ':id' => $id,
        ]);
        send_success(null, "Gallery updated successfully");

    case 'DELETE':
        if (!$id) send_error("Gallery id is required", 422);
        $photos = $conn->prepare("SELECT filename FROM gallery_photos WHERE gallery_id = :id");
        $photos->execute([':id' => $id]);
        foreach ($photos->fetchAll() as $p) {
            $path = __DIR__ . '/../uploads/galleries/' . $p['filename'];
            if (file_exists($path)) @unlink($path);
        }
        $stmt = $conn->prepare("DELETE FROM galleries WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_success(null, "Gallery deleted successfully");

    default:
        send_error("Method not allowed", 405);
}