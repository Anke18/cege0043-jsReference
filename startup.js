function trackAndCircle(){
		
	trackLocation();
	addPointLinePoly();
	getEarthquakes();
}

function startup(){
	document.addEventListener('DOMContentLoaded',
	function(){trackAndCircle();}, false);
}