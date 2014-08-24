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

$hpass = password_hash($pass, PASSWORD_BCRYPT);

if ($result = mysqli_query($con,$validateEmail)) {
	 if ($result->num_rows == 0){	
		$sql = "INSERT INTO `newUsers`(`email`, `type`, `date`, `ssid`, `hashpass`) VALUES ('$email', '$type', '$date', '$ssid', '$pass')";
		//" INSERT INTO `newUsers`(`email`, `type`, `date`, `ssid`, 'hashpass') VALUES ('$email', '$type', '$date', '$ssid', '$pass') ";
		
		//"INSERT INTO newUsers (Email, CreationDate, UserRef, Type, id) VALUES ('$email','$date','$email','Host','$ssid')";
		//INSERT INTO `newUsers`(`email`, `type`, `date`, `state`, `zipcode`, `address`, `hashpass`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7])
		mysqli_query($con,$sql);
	}
}
mysqli_close($con);
?>
