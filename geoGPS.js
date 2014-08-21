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
        }

	    new google.maps.Marker({position: {lat: position.coords.latitude, lng: position.coords.longitude}, map: map});
	    var latlong = [position.coords.latitude, position.coords.longitude];
	    map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
	    GpsFence.pNum += 1;
	// GpsFence.newpoints();
}

GpsFence.newpoints = function(){  
	    
	navigator.geolocation.getCurrentPosition(function(position) {
	    
	});
};