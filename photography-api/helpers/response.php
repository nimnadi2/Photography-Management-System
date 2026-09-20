<?php

function send_success($data = null, $message = "OK", $code = 200)
{
    http_response_code($code);
    echo json_encode([
        "success" => true,
        "message" => $message,
        "data" => $data,
    ]);
    exit();
}

function send_error($message = "Something went wrong", $code = 400, $errors = null)
{
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message,
        "errors" => $errors,
    ]);
    exit();
}

function get_json_body()
{
    $body = json_decode(file_get_contents("php://input"), true);
    return $body ?: [];
}