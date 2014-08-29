(function(){
	var app = angular.module('application',[]);
	
	app.controller('Signin', function(){
		this.person = Brian;
		this.application = Application;
	});
	
	app.controller('Application', ['$scope','$http', function($scope,$http) {
      	
      	//$http is working in this
	    this.div = 'sign';
		this.auth = true;
		
		// To either show host settings, or guest scan functionality.

		this.guest = false;
		this.ahost = false;

		// Used to display user's data
		this.userEmail = '';
		this.userName = '';
		this.ssid = ''; 
		
		// creates our object to send in the ajax $http request
		this.getData = function(obj){
			if(this.div == 'register'){
				for( var properties in obj){
					ourobj[properties] = obj[properties];
				}
				this.sendRequest(ourobj, 'register');
			}else{
				for( var properties in obj){
					loginobj[properties] = obj[properties];
				}
				this.sendRequest(loginobj, 'login');
			} 
			this.newUser = {};
		};
		
		// Sets auth to true or false, and checks if user has signed in correctly
		// then proceeds to show functionality.
		this.authFunc = function(data){
			if(typeof data != null && data != ' null' && data != undefined && data != " "){
				this.auth = false;
				this.userEmail = data.email;
				this.userName = data.email;
				if(data.hashpass){
					this.ahost = true;
					this.ssid = data.hashpass;
				}
			}else{
				this.auth = true;
				alert('Error logging in');
			}
		};
		
		//	called with the user obj as parameter and direction whether it be login or register
		this.sendRequest = function(obj, direction){
			var page = this;
			var flag = true;
			if(obj == undefined){
				alert('Enter Information');
			}else{
				for(var property in obj){
					if(obj[property] == undefined || obj[property] == null || obj[property] == ""){
						flag = false;
						break;
					}
				}
				// Check if obj ha
				if(flag == true){
					//newdata is not used
					//var newdata = "email=" + obj.email + "&pass=" + obj.pass + "&cpass=" + obj.cpass + "&ssid=" + obj.ssid;
					if(direction == 'register'){
						obj.regtime = new Date().toJSON().substr(0,10);
						var $promise = $http.post("../php-bin/geoPassUpdateNewUsers.php",obj);
						$promise.then(function(msg){
							if(msg.statusText  == "OK"){ 
								// can be used for login form and have to compare the data recieved and the data in form.
								console.log('success geoPassUpdateNewUsers');
								page.authFunc(obj);
							}else{
								console.log('unsuccessful login geoPassUpdateNewUsers');
								page.authFunc(msg);
							}
						});
					}else if(direction == 'login'){
						// should change script to $http.get();
							var $promise = $http.post("../php-bin/geoPassUsers.php",obj).success(function(data) {
								//app.people = data;
									console.log('success:' + data);
									page.authFunc(data);
							  }).error(function(data){
									console.log('error:' + data);
									page.authFunc(data);
							  });
					}
					
				}else{
					console.log('Error fields missing in object');
				}
			}
		};
		
		// Sets the div to be show when the login or register buttons are clicked
		this.getDiv = function(){
			if(this.div == 'sign'){
				return 1;
			}
			else if(this.div == 'register'){
				return 2;
			}
		};
		
		// 	Assign div name to controllers div property
		this.setDiv = function(div){
			this.div = div;
		};
		
		// Assigns user type drop down text when value is clicked 
		this.buttonText = 'User Type:';
		this.setText = function(text){
			this.buttonText = text;
			ourobj.type = this.buttonText;
		}
	}]);
	

	var ourobj = {
		email : '',
		pass : '',
		cpass : '',
		ssid : '',
		type:''
	}
	
	var loginobj = {
		email:"",
		pass:""
	}
	
	var Application = {
		title : 'GeoPass',
		version :0.1,
		programmer : 'Brian Inoa'
	}
	
	var Brian = {
		name : 'Brian',
		age:		22,
		goal:		'Learn Angular JS in one week!'
	}	
})();