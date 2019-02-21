// create a variable that will hold the XMLHttpRequest()
var client;
var earthquakes;

function addPointLinePoly() {
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
	// add a circle
	L.circle([51.508, -0.11], 500, {color: 'red', fillColor: '#f03', fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a circle.");
	// add a polygon
	var myPolygon = L.polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]],{color: 'red', fillColor: '#f03', fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a polygon");
}


// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes() {
	client = new XMLHttpRequest();
	client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse; // not earthquakeResponse()
	client.send();
}

function earthquakeResponse() {
	if (client.readyState == 4) {
	var earthquakedata = client.responseText;
	loadEarthquakelayer(earthquakedata);}
}
		
// convert the received data
function loadEarthquakelayer(earthquakedata) {
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	earthquakes = earthquakejson;
	// add the JSON layer onto the map
	earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
}

