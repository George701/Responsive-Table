<?php
$date_array = getdate();

$time = $date_array['mday'] . "/";
$time .= $date_array['mon'] . "/";
$time .= $date_array['year']. " ";
$time .= $date_array['hours']. ":";
$time .= $date_array['minutes']. ":";
$time .= $date_array['seconds'];

$name = $_POST['name'];
$action = $_POST['action'];
$message = $_POST['message'];
$status = $_POST['status'];

$conn = new mysqli('localhost', 'root', '', 'mydb');
if($conn->connect_error){
    echo 'Could not connect to database: '.$conn->connect_error;
}
$stmt = $conn->prepare("INSERT into current_test (time, name, action, message, status) VALUES (?,?,?,?,?)");
$stmt->bind_param("ssiii", $time, $name, $action, $message, $status);

if($stmt->execute()){
    echo "success";
}else{
    echo "error";
}
?>