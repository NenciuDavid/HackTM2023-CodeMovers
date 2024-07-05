<?php
$servername = "localhost";
$username = "tri2001_cdg_ttm";
$password = "cdgtranzit1234";
$dbname = "tri2001_cdg_tranzittm";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexiunea la baza de date a eșuat: " . $conn->connect_error);
}

$stationName = $_GET['name']; // Obțineți numele stației din parametrul GET

$sql = "SELECT * FROM statii WHERE nume = '$stationName'"; // Filtrați rezultatele după nume
$result = $conn->query($sql);

$row = $result->fetch_assoc();

if ($result->num_rows > 0)
{
    $id_ruta = $row['id-rute'];

    $sql = "SELECT * FROM rute WHERE id = '$id_ruta'"; // Filtrați rezultatele după nume
    $result = $conn->query($sql);

    $row = $result->fetch_assoc();

    if ($result->num_rows > 0)
    {
        $nume = $row['nume'];

        header('Content-Type: application/json');

        echo json_encode(array('nume' => $nume));
    }

    else
    {
        echo "Nu s-au găsit rezultate (2).";
    }
}

else
{
    echo "Nu s-au găsit rezultate.";
}

$conn->close();
?>
