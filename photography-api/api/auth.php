<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

$database = new Database();
$conn = $database->connect();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $action === 'login') {
    $body = get_json_body();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        send_error("Email and password are required", 422);
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        send_error("Invalid email or password", 401);
    }

    $token = create_session($conn, $user['id']);
    unset($user['password']);

    send_success(["token" => $token, "user" => $user], "Logged in successfully");
}

if ($method === 'POST' && $action === 'register') {
    $body = get_json_body();
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$name || !$email || !$password) {
        send_error("Name, email and password are required", 422);
    }
    if (strlen($password) < 6) {
        send_error("Password must be at least 6 characters", 422);
    }

    $check = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        send_error("An account with this email already exists", 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, 'photographer')");
    $stmt->execute([':name' => $name, ':email' => $email, ':password' => $hash]);
    $userId = $conn->lastInsertId();

    $token = create_session($conn, $userId);
    send_success([
        "token" => $token,
        "user" => ["id" => $userId, "name" => $name, "email" => $email, "role" => "photographer", "avatar" => null],
    ], "Account created successfully", 201);
}

if ($method === 'GET' && $action === 'me') {
    $user = require_auth($conn);
    send_success($user);
}

if ($method === 'POST' && $action === 'logout') {
    $token = get_bearer_token();
    if ($token) {
        $stmt = $conn->prepare("DELETE FROM sessions WHERE token = :token");
        $stmt->execute([':token' => $token]);
    }
    send_success(null, "Logged out");
}

send_error("Unknown auth action", 404);