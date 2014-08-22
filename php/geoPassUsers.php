 <?php

$user = json_decode(file_get_contents('php://input'));
$email = $user->email;
$pass = $user->pass;

$con = mysqli_connect("localhost", "inoaurxc_admin", "Aug2014B", "inoaurxc_GeoPass");
// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error(); 
}

$validateEmail = "SELECT `Email` FROM `newUsers` WHERE `Email` = '$email' ";
 
if ($result = mysqli_query($con,$validateEmail)) {
	 if ($result->num_rows == 1){
		$date = '2014-08-13'; 
		//$sql = "INSERT INTO newUsers (Email, CreationDate, UserRef, Type, id) VALUES ('$email','$date','$email','Host','$ssid')";
		$sql = "SELECT `email`, `type`, `date`, `state`, `zipcode`, `address`, `hashpass` FROM `newUsers` WHERE `hashpass` = '$pass' ";
		
		$result = mysqli_query($con,$sql);
		
		$row = mysqli_fetch_assoc($result);
		
		$val = json_encode($row);
		
		echo ($val);
		
	} 
}
mysqli_close($con);
?>