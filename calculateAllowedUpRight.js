/* 
onmessage = function (oEvent) {
	var Event = JSON.parse(oEvent);
  	var point = Event.data.point;
  	var distance = Event.data.distance;

	var initialdistance =  (Math.ceil(point) - point);
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
	}

  postMessage("allowed upRIGHT " + allowed);
};*/

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
	while( ( point < (distance + (endValue) ) ) ) {
		point += 0.0001;

		point = Math.round(point*10000)/10000;
		
		p = Math.round(point*10000)/10000;

		allowed.push(p);
	}

  	self.postMessage('command: ' + allowed);
}, false);