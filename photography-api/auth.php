<?php
require_once __DIR__ . '/response.php';

/**
 * Very small bearer-token auth system.
 * Avoids composer/JWT dependencies so the project runs on a bare Laragon
 * install with nothing but PHP + MySQL.
 */

function generate_token()
{
    return bin2hex(random_bytes(32));
}

function create_session($conn, $user_id)
{
    $token = generate_token();
    $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

    $stmt = $conn->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (:user_id, :token, :expires)");
    $stmt->execute([
        ':user_id' => $user_id,
        ':token' => $token,
        ':expires' => $expires,
    ]);

    return $token;
}

function get_bearer_token()
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }
    return null;
}

/**
 * Returns the authenticated user array, or sends a 401 + exits.
 */
function require_auth($conn)
{
    $token = get_bearer_token();
    if (!$token) {
        send_error("Authorization token missing", 401);
    }

    $stmt = $conn->prepare(
        "SELECT u.id, u.name, u.email, u.role, u.avatar
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = :token AND s.expires_at > NOW()
         LIMIT 1"
    );
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        send_error("Invalid or expired session, please log in again", 401);
    }

    return $user;
}