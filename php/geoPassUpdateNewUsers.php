<?php

$user = json_decode(file_get_contents('php://input'));
$email = $user->email;
$pass = $user->pass;
$cpass = $user->cpass;
$ssid = $user->ssid;
$type = $user->type;
$date = $user->regtime;

$con = mysqli_connect("localhost", "", "", "");
// Check connection
if (mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error(); 
}

$validateEmail = "SELECT `Email` FROM `newUsers` WHERE `Email` = '$email' ";

if ($result = mysqli_query($con,$validateEmail)) {
	 if ($result->num_rows == 0){	
		$sql = "INSERT INTO `newUsers`(`email`, `type`, `date`, `ssid`, `hashpass`) VALUES ('$email', '$type', '$date', '$ssid', '$pass')";
		mysqli_query($con,$sql);
	}
}
mysqli_close($con);
<<<<<<< HEAD
?> 
=======
?>
>>>>>>> cf589ea599aaa7da09b157cd90e1161ca4ce607d
