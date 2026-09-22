<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

$database = new Database();
$conn = $database->connect();
$user = require_auth($conn);

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/../uploads/galleries/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

switch ($method) {

    case 'POST': // upload one or more photos to a gallery
        $galleryId = $_POST['gallery_id'] ?? null;
        if (!$galleryId) send_error("gallery_id is required", 422);
        if (empty($_FILES['photos'])) send_error("No files uploaded", 422);

        $files = $_FILES['photos'];
        $count = is_array($files['name']) ? count($files['name']) : 1;
        $uploaded = [];

        for ($i = 0; $i < $count; $i++) {
            $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $tmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $type = is_array($files['type']) ? $files['type'][$i] : $files['type'];
            $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($error !== UPLOAD_ERR_OK) continue;
            if (!in_array($type, $allowedTypes)) continue;

            $ext = pathinfo($name, PATHINFO_EXTENSION);
            $filename = uniqid('photo_', true) . '.' . $ext;

            if (move_uploaded_file($tmp, $uploadDir . $filename)) {
                $stmt = $conn->prepare("INSERT INTO gallery_photos (gallery_id, filename, original_name) VALUES (:gid, :filename, :original)");
                $stmt->execute([':gid' => $galleryId, ':filename' => $filename, ':original' => $name]);
                $uploaded[] = ["id" => $conn->lastInsertId(), "filename" => $filename];
            }
        }

        if (empty($uploaded)) send_error("No valid image files were uploaded (jpg, png, webp only)", 422);
        send_success($uploaded, count($uploaded) . " photo(s) uploaded successfully", 201);

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) send_error("Photo id is required", 422);

        $stmt = $conn->prepare("SELECT filename FROM gallery_photos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $photo = $stmt->fetch();
        if (!$photo) send_error("Photo not found", 404);

        $path = $uploadDir . $photo['filename'];
        if (file_exists($path)) @unlink($path);

        $del = $conn->prepare("DELETE FROM gallery_photos WHERE id = :id");
        $del->execute([':id' => $id]);
        send_success(null, "Photo deleted successfully");

    default:
        send_error("Method not allowed", 405);
}