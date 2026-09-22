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

$baseSelect = "SELECT i.*, b.title AS booking_title, c.name AS client_name, c.email AS client_email
               FROM invoices i
               JOIN bookings b ON b.id = i.booking_id
               JOIN clients c ON c.id = b.client_id";

function next_invoice_number($conn)
{
    $year = date('Y');
    $stmt = $conn->prepare("SELECT COUNT(*) AS c FROM invoices WHERE invoice_number LIKE :prefix");
    $stmt->execute([':prefix' => "INV-$year-%"]);
    $count = (int) $stmt->fetch()['c'] + 1;
    return sprintf("INV-%s-%04d", $year, $count);
}

switch ($method) {

    case 'GET':
        if ($id) {
            $stmt = $conn->prepare($baseSelect . " WHERE i.id = :id");
            $stmt->execute([':id' => $id]);
            $invoice = $stmt->fetch();
            if (!$invoice) send_error("Invoice not found", 404);
            send_success($invoice);
        }

        $status = $_GET['status'] ?? '';
        $sql = $baseSelect;
        $params = [];
        if ($status) {
            $sql .= " WHERE i.status = :status";
            $params[':status'] = $status;
        }
        $sql .= " ORDER BY i.issued_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        send_success($stmt->fetchAll());

    case 'POST':
        $body = get_json_body();
        if (empty($body['booking_id']) || empty($body['amount'])) {
            send_error("booking_id and amount are required", 422);
        }

        $invoiceNumber = next_invoice_number($conn);
        $issued = $body['issued_date'] ?? date('Y-m-d');
        $due = $body['due_date'] ?? date('Y-m-d', strtotime('+7 days'));

        $stmt = $conn->prepare("INSERT INTO invoices (booking_id, invoice_number, amount, status, issued_date, due_date)
            VALUES (:booking_id, :invoice_number, :amount, :status, :issued_date, :due_date)");
        $stmt->execute([
            ':booking_id' => $body['booking_id'],
            ':invoice_number' => $invoiceNumber,
            ':amount' => $body['amount'],
            ':status' => $body['status'] ?? 'unpaid',
            ':issued_date' => $issued,
            ':due_date' => $due,
        ]);
        send_success(["id" => $conn->lastInsertId(), "invoice_number" => $invoiceNumber], "Invoice created successfully", 201);

    case 'PUT':
        if (!$id) send_error("Invoice id is required", 422);
        $body = get_json_body();

        $paidDate = $body['status'] === 'paid' ? ($body['paid_date'] ?? date('Y-m-d')) : null;

        $stmt = $conn->prepare("UPDATE invoices SET amount=:amount, status=:status, due_date=:due_date, paid_date=:paid_date WHERE id=:id");
        $stmt->execute([
            ':amount' => $body['amount'] ?? 0,
            ':status' => $body['status'] ?? 'unpaid',
            ':due_date' => $body['due_date'] ?? date('Y-m-d'),
            ':paid_date' => $paidDate,
            ':id' => $id,
        ]);
        send_success(null, "Invoice updated successfully");

    case 'DELETE':
        if (!$id) send_error("Invoice id is required", 422);
        $stmt = $conn->prepare("DELETE FROM invoices WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_success(null, "Invoice deleted successfully");

    default:
        send_error("Method not allowed", 405);
}