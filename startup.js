function trackAndCircle(){
		
	trackLocation();
	addPointLinePoly();
	getEarthquakes();
	getPort();
	loadW3HTML();
}

function startup(){
	document.addEventListener('DOMContentLoaded',
	function(){getPort();}, false);
}

function loadW3HTML()
{
	w3.includeHTML();
}