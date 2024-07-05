<?php
$servername = "localhost";
$username = "tri2001_cdg_ttm";
$password = "cdgtranzit1234";
$dbname = "tri2001_cdg_tranzittm";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexiunea la baza de date a eșuat: " . $conn->connect_error);
}

$bus_id = $_GET['busid'];

$sql = "SELECT * FROM `autobuze-live` WHERE `id-bus` = '$bus_id' ORDER BY `id` DESC";
$result = $conn->query($sql);

$row = $result->fetch_assoc();

if ($result->num_rows > 0) {
    $lat = $row['latitudine'];
    $lon = $row['longitudine'];

    header('Content-Type: application/json');

    echo json_encode(array('lat' => $lat, 'lon' => $lon));
} else {
    echo "Nu s-au găsit rezultate.";
}

$conn->close();

?>
