<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$shopwareClientId = "SWIAVKLPDTRXNDDXWGS3AES0DW";
$shopwareClientSecret = "ZGxueGp5VnNHdUhzdjlvUEdneDFRNm1oUFlLamkxZWg0STE2SWY";
$shopwareTokenUrl = "http://shopware/api/oauth/token";  // Container URL
$shopwareCustomerUrl = "http://shopware/api/search/customer";  // Container URL

// Funktion zum Abrufen eines neuen Access Tokens
function getAccessToken($shopwareClientId, $shopwareClientSecret, $shopwareTokenUrl) {
    $data = json_encode([
        "grant_type" => "client_credentials",
        "client_id" => $shopwareClientId,
        "client_secret" => $shopwareClientSecret
    ]);

    $ch = curl_init($shopwareTokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);

    // Hinzufügen von Debugging-Optionen
    curl_setopt($ch, CURLOPT_VERBOSE, true); // Gibt zusätzliche Debug-Informationen aus
    curl_setopt($ch, CURLOPT_STDERR, fopen('php://output', 'w')); // Gibt Fehlerausgaben an die Konsole weiter

    $response = curl_exec($ch);

    // Überprüfen auf Fehler
    if ($response === false) {
        echo json_encode(["error" => "cURL-Fehler: " . curl_error($ch)]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    // Die API-Antwort für das Access Token ausgeben, um den Fehler zu sehen
    $tokenData = json_decode($response, true);

    if (isset($tokenData["error"])) {
        echo json_encode(["error" => "Fehler beim Abrufen des Access Tokens: " . $tokenData["error_description"]]);
        exit;
    }

    return $tokenData["access_token"] ?? null;
}

// Token abrufen
$accessToken = getAccessToken($shopwareClientId, $shopwareClientSecret, $shopwareTokenUrl);

if (!$accessToken) {
    echo json_encode(["error" => "Fehler beim Abrufen des Access Tokens."]);
    exit;
}

// POST-Daten auslesen
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $inputJSON = file_get_contents("php://input");
    $input = json_decode($inputJSON, true);

    if (!isset($input["email"]) || empty($input["email"])) {
        echo json_encode(["error" => "Bitte eine E-Mail eingeben!"]);
        exit;
    }
    $email = trim($input["email"]);

    // Suchanfrage für Kunden
    $requestData = json_encode([
        "filter" => [[
            "type" => "equals",
            "field" => "email",
            "value" => $email
        ]]
    ]);

    $ch = curl_init($shopwareCustomerUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        echo json_encode(["error" => "Fehler beim Abrufen der Kundendaten."]);
        exit;
    }

    $data = json_decode($response, true);

    // Prüfen, ob Kundendaten vorhanden sind
    if (isset($data["data"]) && count($data["data"]) > 0) {
        echo json_encode(["customer" => $data["data"][0]]);
    } else {
        echo json_encode(["error" => "Kein Kunde mit dieser E-Mail gefunden."]);
    }
} else {
    echo json_encode(["error" => "Ungültige Anfrage."]);
}
?>