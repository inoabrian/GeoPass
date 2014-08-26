var GpsFence = {
	valid : false,
	points: [],
	pNum: 1,
	name:'description',
	map: null,
	allowedLat: null,
	allowedLong: null,
	called : 0
};
 
GpsFence.getGps = function(){
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.addGps);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

GpsFence.isValid = function(){ 
	var num = 0;
	for(var iterator = 0; iterator < this.points.length; iterator++){
		if(this.points[iterator] != undefined){
			num += 1;
		}
	}
	if(num == 4){ 
		this.valid = true;
	}
};

GpsFence.addGps = function (position){

	var latitude  = position.coords.latitude;
	var longitude = position.coords.longitude;
 
	GpsFence.points.push(latitude,longitude);

	latLong = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude)
	    var mapOptions = {
			zoom: 20,
			center: latLong,
			disableDefaultUI: true
		};
		if(GpsFence.pNum == 1){
        	GpsFence.map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        
	    	new google.maps.Marker({position: {lat: position.coords.latitude, lng: position.coords.longitude}, map: GpsFence.map});
	    	var latlong = [position.coords.latitude, position.coords.longitude];
	    	GpsFence.map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
	    	GpsFence.pNum += 1;
	    	document.getElementById('setGPS').innerHTML = 'GPS SET'; 
	    	GpsFence.allowedPoints({lat: position.coords.latitude, lng: position.coords.longitude});
		}else{
			console.log('You already set your first point.');
		}
}

GpsFence.allowedPoints = function(singlePoint){ 
	    var latitude = singlePoint.lat;
	    var longitude = singlePoint.lng;

	    // I have to generate east, west allowed points.
	    // Then I have to generate the north, south allowed points.

	    var latitudeDifference = (Math.ceil(latitude) - latitude);
	    var longitudeDifference = (Math.ceil(longitude) - longitude);

	    GpsFence.calculateAllowedUpRight(latitude, parseFloat(".00002"), 'latitude');
	    GpsFence.calculateAllowedUpRight(longitude, parseFloat(".00002"), 'longitude');
	    GpsFence.calculateAllowedDownLeft(latitude, parseFloat(".00002"), 'latitude');
	    GpsFence.calculateAllowedDownLeft(longitude, parseFloat(".00002"), 'longitude');
	    

};

GpsFence.calculateAllowedUpRight = function(point,distance,pointType){
	var distance = distance;

	var myWorker = new Worker("calculateAllowedUpRight.js");

	var pointer = GpsFence;
	myWorker.onmessage = function (oEvent) {

	  if(pointType == 'latitude'){
	  	GpsFence.allowedLat = JSON.parse(oEvent.data);
	  	pointer.doneCalculating();
	  }else{
	  	GpsFence.allowedLong = JSON.parse(oEvent.data);
	  	pointer.doneCalculating();
	  }
	  myWorker.terminate();
	  //pointer.doneCalculating();
	};

	obj = {
		point : point,
		distance : distance
	};

	myWorker.postMessage(JSON.stringify(obj));
	
};

GpsFence.calculateAllowedDownLeft = function( point,distance, pointType){
	var distance = distance;
	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;

	var endValue;

	point = Math.round(point*10000)/10000;  

	var negWorker = new Worker("calculateAllowedDownLeft.js");

	var pointer = GpsFence;

	negWorker.onmessage = function (oEvent) {
		//console.log("Worker calculateAllowedDownLeft said : " + oEvent.data);
		  if(pointType == 'latitude'){
	  		GpsFence.allowedLat = JSON.parse(oEvent.data);
	  		pointer.doneCalculating();
		  }else{
		  	GpsFence.allowedLong = JSON.parse(oEvent.data);
		  	pointer.doneCalculating();
		  }
		  negWorker.terminate();
		//pointer.doneCalculating(oEvent.data);
	};

	obj = {
		point : point,
		distance : distance
	};

	negWorker.postMessage(JSON.stringify(obj));
};

GpsFence.doneCalculating = function(){
	if(GpsFence.called != 2){
		GpsFence.called += 1;
	}else{
		
		for(var i = 0; i < GpsFence.allowedLong.longitude.length && i < GpsFence.allowedLat.latitude.length; i++){
			new google.maps.Marker({position: {lat: GpsFence.allowedLat.latitude[i] , lng: GpsFence.allowedLong.longitude[i]}, map: GpsFence.map});
		}
		console.log('done calculating');
	}
	//console.log('data reached done calculating: ' + data);
	/*var allowed = JSON.parse(data);
	if(typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    	localStorage.setItem("allowed", allowed.latitude);
	} else {
	    // Sorry! No Web Storage support..
	}
	*/
};



