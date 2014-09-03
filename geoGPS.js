var GpsFence = {
	valid : false,
	points: [],
	pNum: 1,
	name:'description',
	map: null,
	allowedLat: null,
	allowedLong: null,
	called : 0,
	newpoints: [],
	id: null,
	watchCount : 0
};
var watchId = 0;
 
GpsFence.getGps = function(){
	//if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(this.addGps);
    //} else {
    //    alert("Geolocation is not supported by this browser.");
    //}
    var getGpsOptions = {
	  enableHighAccuracy: false,
	  timeout: 100,
	  maximumAge: 0
    };

   //  if (navigator.geolocation) {
   //  	navigator.geolocation.watchPosition(getGpsSuccess, getGpsError, getGpsOptions);
   //  }

 watchId = navigator.geolocation.watchPosition(GpsFence.centerMap, null,getGpsOptions); 

};

GpsFence.centerMap = function(location)
{
	//var myLatlng = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
	//map.setCenter(myLatlng);
	//map.setZoom(17);
	GpsFence.watchCount++;

//do it 2 times
	if(location.coords.accuracy <= 10)
	{
		alert(location.coords.accuracy);
		//show current location on map
		//don’t need to watch anymore
		alert('Found');
		navigator.geolocation.clearWatch(watchId);
		alert('called');
		GpsFence.addGps(location);
	}else{
		alert('try moving around for accuracy: ' + location.coords.accuracy + ', ' + GpsFence.watchCount);
	}
}
// getGpsSuccess = function(position){
// 	var getGpsOptions = {
// 	  enableHighAccuracy: true,
// 	  timeout: Infinity,
// 	  maximumAge: 0
//     };
// 	if(position){
// 		console.log(position);
// 	}
// 	if(position.coords.accuracy < 20)
// 		console.log(position.coords);
// 	else
// 		navigator.geolocation.watchPosition(getGpsSuccess,getGpsError, getGpsOptions);
// };

// getGpsError = function(error){
// 	console.log(error);
// };

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

	    	// Call allowed Points awith lat,long
	    	GpsFence.allowedPoints({lat: position.coords.latitude, lng: position.coords.longitude});
		}else{
			console.log('You already set your first point.');
		}
}

// Calculate  points that create a 10 ft circle border around
GpsFence.allowedPoints = function(singlePoint){ 
	    var latitude = singlePoint.lat;
	    var longitude = singlePoint.lng;
	    GpsFence.allowedLat = latitude;
	    GpsFence.allowedLong = longitude;
	    // I have to generate east, west allowed points.
	    // Then I have to generate the north, south allowed points.

	    var latitudeDifference = (Math.ceil(latitude) - latitude);
	    var longitudeDifference = (Math.ceil(longitude) - longitude);

	    //--GpsFence.calculateAllowedUpRight([latitude,longitude], distance in feet, 'latitude', callbackFunction);
	    var callback = GpsFence.doneCalculating;

	    for(var iterations = 0; iterations < 360; iterations++){
	    	if((iterations % 12) == 0){
	    		var pointsToPush = geoDestination([latitude,longitude], parseFloat('0.003048'), iterations, callback);
	    		GpsFence.newpoints.push(pointsToPush);
	    	}
	    }
    	callback();

    	GpsFence.addHostCoords(GpsFence.newpoints);
	    
};

//start is a array [lat, long]
//dist in km
//brng in degrees
function geoDestination(start, dist, brng, callback){
   lat1 = toRad(start[0]);
   lon1 = toRad(start[1]);
   dist = dist/6371.01; //Earth's radius in km
   brng = toRad(brng);

   lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) +
              Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
   lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1),
                      Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
   lon2 = fmod((lon2+3*Math.PI),(2*Math.PI)) - Math.PI;  
   callback();
   return [toDeg(lat2),toDeg(lon2)];
}

function toRad(deg){
   return deg * Math.PI / 180;
}

function toDeg(rad){
   return rad * 180 / Math.PI;
}

function fmod(a, b) {
   return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
}



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


// Create and display the circular border around the point.
GpsFence.doneCalculating = function(){
	if(GpsFence.called != 10){
		GpsFence.called += 1;
	}else{
		
		for(var i = 0; i < GpsFence.newpoints.length; i++){
			new google.maps.Marker({position: {lat: GpsFence.newpoints[i][0] , lng:  GpsFence.newpoints[i][1]}, map: GpsFence.map});
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

// Retreives point from Guest who is searching for Host  
GpsFence.checkingThePoints = function (){
	if ("geolocation" in navigator) {
		var option = {
			enableHighAccuracy: 	true,
			timeout: 				Infinity,
			maximumAge: 			0
		};

		GpsFence.id = navigator.geolocation.watchPosition(success, fail, option);
  /* geolocation is available */
	} else {
	  /* geolocation IS NOT available */
	}
};

function success (position){
	
	var latLngCircleCenter = new google.maps.LatLng(GpsFence.allowedLat, GpsFence.allowedLong);

	var maxDist = 3.048;

	for(var iterator = 0; iterator < GpsFence.newpoints.length; iterator++){ 

		var comparePoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		var distanceInMetres = google.maps.geometry.spherical.computeDistanceBetween(latLngCircleCenter, comparePoint);

		if(distanceInMetres <= maxDist){

			maxDist  = distanceInMetres;

   			console.log('Max Dist: ' + maxDist);
   			console.log('Distance In Meters: ' + distanceInMetres);
			var image = "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-666666/shapecolor-dark/shadow-1/border-white/symbolstyle-white/symbolshadowstyle-no/gradient-no/number_" + (iterator + 1) + ".png";
   			new google.maps.Marker({
			      position: comparePoint,
			      map: GpsFence.map,
			      icon: image,
			      draggable:false
		    });
		    //ajax call for pass word and send it to updatePass.
		    var pass = '123#Bd';
		    var bool = updatePass(pass);
		    navigator.geolocation.clearWatch(GpsFence.id);
		    
   			return bool;
   		}else if(maxDist > distanceInMetres && maxDist < 10000){
   			alert('max ! > distanceInMetres && maxDist < 10000')	
   		}
   }
};

function fail (){
	alert('error getting points');
}

function updatePass(Geopass){
	$('#pass').html('<p>' + Geopass + '</p>');
	return false;
}


GpsFence.addHostCoords = function(coordData){
	alert(GpsFence.newpoints.length);

	// using Local storage because I do not have a geo database to store the gps points.
	// this makes it easier to just take it and parse the data.

	localStorage.setItem('HostCoord', coordData);
		
	console.log(JSON.parse(localStorage.getItem('HostCoord')));
	/*$.ajax({
		type: "POST",
		url: '../php-bin/setCoords.php',
		data: coordData,
		success: coordsuccess,
		dataType: dataType
	});*/

	/*$.post('../php-bin/setCoords.php',
		coordData,
		function(){

		}
	);*/
};