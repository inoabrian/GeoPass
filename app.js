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
		
		this.userEmail = '';
		this.userName = '';
		this.ssid = ''; 
		
		this.getData = function(obj){
			if(this.div == 'register'){
				if(obj.type = "Guest"){
					obj.ssid = 'Guest';
				}
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
		
		this.authFunc = function(data){
			if(typeof data != ' null'){
				this.auth = false;
				this.userEmail = data.email;
				this.userName = data.email;
				this.ssid = data.hashpass;
				console.log(data.ssid);
			}
		};
		
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
				if(flag == true){
					var newdata = "email=" + obj.email + "&pass=" + obj.pass + "&cpass=" + obj.cpass + "&ssid=" + obj.ssid;
					if(direction == 'register'){
						obj.regtime = new Date().toJSON().substr(0,10);
						var $promise = $http.post("../php-bin/geoPassUpdateNewUsers.php",obj);
						$promise.then(function(msg){
							if(msg.statusText  == "OK"){ 
								 // can be used for login form and have to compare the data recieved and the data in form.
									console.log('success geoPassUpdateNewUsers');
									page.authFunc(msg);
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
		
		this.getDiv = function(){
			if(this.div == 'sign'){
				return 1;
			}
			else if(this.div == 'register'){
				return 2;
			}
		};
		
		this.setDiv = function(div){
			this.div = div;
		};
		
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