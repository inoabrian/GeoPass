var GpsFence = {
	valid : false,
	points: [],
	name:'description'
};
 
GpsFence.getGps = function(){
	var pNum = 1;
	var point = 'point-' + pNum;
	this.points.push({ points : gpsPoint });
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
