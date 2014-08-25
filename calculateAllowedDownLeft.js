/*
onmessage = function (oEvent) {

	var Event = JSON.parse(oEvent.data);
	var point = Event.point;
  	var distance = Event.data.distance;

	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;
	var endValue  = Math.ceil(point);

	endValue = Math.round(endValue*10000)/10000;

	point = Math.round(point*10000)/10000;
	var allowed = new Array();
	if(point < 0){
		while( ( point > ( endValue - (distance / 2) ) ) ) {
			if(point.toString().length == 5){
				point += 0.001; 
			}else{
				point += 0.0001;
			}
			point = Math.round(point*10000)/10000;

			allowed.push(point);
		}
		alert('done');
	}else{
		while( ( point > (endValue - distance) ) ) {
			point -= 0.0001;

			point = Math.round(point*10000)/10000;

			allowed.push(point); 
		}
	}
	postMessage("allowed: " + allowed);

	postMessage('distance: ' + distance + 'point: ' + point + 'allowed: ' + allowed);
}; */

self.addEventListener('message', function(e) {
  	var Event = JSON.parse(e.data);
	var point = Event.point;
  	var distance = Event.distance;

	var initialdistance =  (Math.ceil(point) - point);
	initialdistance = Math.round(initialdistance*10000)/10000;
	var endValue  = Math.ceil(point);

	endValue = Math.round(endValue*10000)/10000;

	point = Math.round(point*10000)/10000;
	var allowed = new Array();
	if(point < 0){
		while( ( point > ( endValue - (distance / 2) ) ) ) {
			if(point.toString().length == 5){
				point += 0.001; 
			}else{
				point += 0.0001;
			}
			point = Math.round(point*10000)/10000;

			allowed.push(point);
		}
		alert('done');
	}else{
		while( ( point > (endValue - distance) ) ) {
			point -= 0.0001;

			point = Math.round(point*10000)/10000;

			allowed.push(point); 
		}
	}
  	self.postMessage('command: ' + allowed);
}, false);