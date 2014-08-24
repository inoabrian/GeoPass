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
	    
	    console.log('Latitude and Longitude Points: from line 57: ' + singlePoint.lat + singlePoint.lng);
	    var latitude = singlePoint.lat;
	    var longitude = singlePoint.lng;

	    // I have to generate east, west allowed points.
	    // Then I have to generate the north, south allowed points.

	    var latitudeDifference = (Math.ceil(latitude) - latitude);
	    var longitudeDifference = (Math.ceil(longitude) - longitude);

	    console.log(latitudeDifference);
	    GpsFence.calculateAllowed(latitude, 10);
	    GpsFence.calculateAllowed(longitude, 10);
};

GpsFence.calculateAllowed = function(point,distance){
	var distance = distance;
	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;
	var endValue  = Math.ceil(point);
	/*console.log(distance);
	console.log('distance');
	console.log(initialdistance);
	console.log('initialdistance');
	console.log(endValue);
	console.log('endValue'); 

	console.log((distance + (point + initialdistance)));
	console.log('added');
	*/

	endValue = Math.round(endValue*10000)/10000;

	point = Math.round(point*10000)/10000;
	var allowed = new Array();
	while( ( point < (distance + (endValue + initialdistance) ) ) ) {
		point += 0.0001;

		point = Math.round(point*10000)/10000;
		
		p = Math.round(point*10000)/10000;

		allowed.push(p);
	}
	console.log(allowed);
};



