<?php
$servername = "localhost";
$username = "tri2001_cdg_ttm";
$password = "cdgtranzit1234";
$dbname = "tri2001_cdg_tranzittm";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error)
{
    die("Conexiunea la baza de date a eșuat: " . $conn->connect_error);
}

$sql = "SELECT * FROM statii";
$result = $conn->query($sql);

if ($result->num_rows > 0)
{
    $rows = array();

    while ($row = $result->fetch_assoc())
    {
        $rows[] = $row;
    }

    header('Content-Type: application/json');

    echo json_encode($rows);
}

else
{
    echo "Nu s-au găsit rezultate.";
}

$conn->close();
?>