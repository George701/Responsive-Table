<?php
error_reporting(0);
$conn = new mysqli('localhost', 'root', '', 'mydb');
if($conn->connect_error){
    echo 'Could not connect to database: '.$conn->connect_error;
}

$sql = "SELECT * FROM current_test ORDER BY id DESC";
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (intval($_POST['last_id']) !== 0) {
        $sql = "SELECT * FROM current_test WHERE id > " . (intval($_POST['last_id'])). " ORDER BY id ASC";
    }

    $result = $conn->query($sql);
    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode($data);

}

