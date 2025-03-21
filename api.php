<?php
header("Content-Type: application/json");
$shopwareApiUrl = "http://localhost/api/search/customer";
$accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJTV0lBVE0xUUVXTjBTMkRWRDNaTUNKWkdVQSIsImp0aSI6IjZiM2E4N2U3OWUxNTczOGU4MTM3ZDlmNTYyOTI2OTcwOWYxZWE2ZTcwMDU3YTU3YzgyZmYyODJkYjlmMDEzMzFhNGU3MzA0Y2NiODBiNWI0IiwiaWF0IjoxNzQyNTQzMTI4LjQ3Mzk1NCwibmJmIjoxNzQyNTQzMTI4LjQ3Mzk1NiwiZXhwIjoxNzQyNTQzNzI4LjQ3Mzc4Mywic3ViIjoiIiwic2NvcGVzIjpbIndyaXRlIl19.GSu8ko6-RQWvDrIW2qx3C0IyTUktLzxANpjF4hf0FFO3kDGYF--UpdU8SbG2Xlxuu0LVuhSsO1Avqzmv6zAOOOaM2panHpPz8qsBJWalBDunLe8fe8nmAeYbFXvhYmucJcR6HkGknwuwemUlt1tj5vnd79FgR04gIPUy801ykkMDhRUPqBF7h9MF3wkT56aaB8RcWd14d0kFidTUJzU_k2k6so33ZK1b7hscaUY_8rOOEb-Q1udfDJI1v9MWpW9Szb69gET-l2w8tfL1YGzKdOpGMuD-19_OmRJrCB4ZVgLCAu74h_8RPb_91HJe_n1vwSP9xjvZVAfJQIyyqu-P5g";

// POST-Request von Frontend empfangen
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";

// Daten für den GET-Request vorbereiten
$requestData = [
    "filter" => [[
        "type" => "equals",
        "field" => "email",
        "value" => $email
    ]]
];
$options = [
    "http" => [
        "header"  => "Content-Type: application/json\r\nAuthorization: Bearer $accessToken\r\n",
        "method"  => "POST",
        "content" => json_encode($requestData)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($shopwareApiUrl, false, $context);

echo "<pre>";
var_dump($responseData);
echo "</pre>";
?>