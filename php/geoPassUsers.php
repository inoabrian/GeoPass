 <?php

$user = json_decode(file_get_contents('php://input'));
$email = $user->email;
$pass = $user->pass;

$con = mysqli_connect("localhost", "", "", "");
// Check connection
if (mysqli_connect_errno()) {
    //echo "Failed to connect to MySQL: " . mysqli_connect_error(); 
     printf("Connect failed: %s\n", mysqli_connect_error());
	 exit();
}

$validateEmail = "SELECT `Email` FROM `newUsers` WHERE `Email` = '$email' ";

 
if ($result = mysqli_query($con,$validateEmail)) {
	 if ($result->num_rows == 1){
		
		$date = '2014-08-13'; 

		$sql = "SELECT `email`, `type`, `date`, `state`, `zipcode`, `address`, `hashpass` FROM `newUsers` WHERE `email` = '$email' && `hashpass` = '$pass'"; 
		//"SELECT `email`, `type`, `date`, `state`, `zipcode`, `address`, `hashpass` FROM `newUsers` WHERE `hashpass` = '$pass'";

		
		$result = mysqli_query($con,$sql);
		
		$row = mysqli_fetch_assoc($result);
		
		$val = json_encode($row);
		
		echo ($val);
	} 
}
mysqli_close($con);
?>
