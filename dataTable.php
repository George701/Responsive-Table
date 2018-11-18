<?php
$conn = new mysqli('localhost', 'root', '', 'mydb');
$sql = "SELECT * FROM current_test";
$result = $conn->query($sql);
$data = array();
if($conn->connect_error){
    echo 'Could not connect to database: '.$conn->connect_error;
}
// fetching data from MySQL database table to array
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }
}
// string JSON format
echo json_encode($data);