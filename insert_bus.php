<?php
$servername = "localhost";
$username = "tri2001_cdg_ttm";
$password = "cdgtranzit1234";
$dbname = "tri2001_cdg_tranzittm";

$id_bus = $_GET["busid"];
$latitudine = $_GET["latitudine"];
$longitudine = $_GET["longitudine"];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexiunea la baza de date a eșuat: " . $conn->connect_error);
}

$sql = "INSERT INTO `autobuze-live` (`id-bus`, `latitudine`, `longitudine`) VALUES ('$id_bus', '$latitudine', '$longitudine')";

if ($conn->query($sql) === TRUE) {
    echo "Datele au fost adăugate în tabelul autobuze.";
} else {
    echo "Eroare la adăugarea datelor: " . $conn->error;
}

//'$nume', '$rutaid', 

$conn->close();
?>

