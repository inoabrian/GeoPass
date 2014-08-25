var GpsFence = {
	valid : false,
	points: [],
	pNum: 1,
	name:'description'
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
        	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        
	    	new google.maps.Marker({position: {lat: position.coords.latitude, lng: position.coords.longitude}, map: map});
	    	var latlong = [position.coords.latitude, position.coords.longitude];
	    	map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
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

	    var latPositive = GpsFence.calculateAllowedUpRight(latitude, 10);
	    var longPositive = GpsFence.calculateAllowedUpRight(longitude, 10);
	    var latNegative = GpsFence.calculateAllowedDownLeft(latitude, 10);
	    var longNegative = GpsFence.calculateAllowedDownLeft(longitude, 10);
};

GpsFence.calculateAllowedUpRight = function(point,distance){
	var distance = distance;
/*	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;
	var endValue  = Math.ceil(point);

	endValue = Math.round(endValue*10000)/10000;

	point = Math.round(point*10000)/10000;
	var allowed = new Array();
	while( ( point < (distance + (endValue) ) ) ) {
		point += 0.0001;

		point = Math.round(point*10000)/10000;
		
		p = Math.round(point*10000)/10000;

		allowed.push(p);
	}*/
	var myWorker = new Worker("calculateAllowedUpRight.js");

	myWorker.onmessage = function (oEvent) {
	  console.log("Worker calculateAllowedUpRight said : " + oEvent.data);
	  return oEvent.data;
	};

	obj = {
		point : point,
		distance : distance
	};

	myWorker.postMessage(JSON.stringify(obj));
	
};

GpsFence.calculateAllowedDownLeft = function( point,distance){
	var distance = distance;
	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;

	var endValue;

	point = Math.round(point*10000)/10000;  

	var negWorker = new Worker("calculateAllowedDownLeft.js");

	negWorker.onmessage = function (oEvent) {
		console.log("Worker calculateAllowedDownLeft said : " + oEvent.data);
		return oEvent.data;
		GpsFence.doneCalculating(oEvent.data);
	};

	obj = {
		point : point,
		distance : distance
	};

	negWorker.postMessage(JSON.stringify(obj));
};

GpsFence.doneCalculating = function(data){
	console.log('data reached done calculating: ' + data);
};



