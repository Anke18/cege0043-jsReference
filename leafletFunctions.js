// create a variable that will hold the XMLHttpRequest()
var client;
var earthquakes;
var xhrFormData;
var formLayer;

function addPointLinePoly()
{
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
	// add a circle
	L.circle([51.508, -0.11], 500, {color: 'red', fillColor: '#f03', fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a circle.");
	// add a polygon
	var myPolygon = L.polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]],{color: 'red', fillColor: '#f03', fillOpacity: 0.5}).addTo(mymap).bindPopup("I am a polygon");
}

function startFormDataLoad()
{
	alert("Port2 : " + httpPortNumber);
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	url = url + "/getFormData/"+httpPortNumber;
	xhrFormData.open("GET", url, true);
	xhrFormData.onreadystatechange = formDataResponse;
	xhrFormData.send();
}

function formDataResponse()
{
	if (xhrFormData.readyState == 4)
	{
		// once the data is ready, process the data
		var formData = xhrFormData.responseText;
		loadFormData(formData);
	}
}

function loadFormData(formData)
{
	// convert the text received from the server to JSON
	var formJSON = JSON.parse(formData);
	formLayer = L.geoJson(formJSON,
	{
		// use point to layer to create the points
		pointToLayer: function(feature, latlng)
		{
			return L.marker(latlng);
		},}).addTo(mymap);
	mymap.fitBounds(formLayer.getBounds());
}

// create the code to get the Earthquakes data using an XMLHttpRequest
//http://developer.cege.ucl.ac.uk:30312/getGeoJSON/london_poi/geom
//http://developer.cege.ucl.ac.uk:30312/getGeoJSON/london_highway/geom
function getEarthquakes()
{
	client = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	url = url + "/getGeoJSON/london_highway/geom";
	client.open("GET", url, true);
	client.onreadystatechange = earthquakeResponse;// not earthquakeResponse()
	client.send();
}

function earthquakeResponse() 
{
	if (client.readyState == 4) 
	{
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
	}
}
		
// convert the received data
function loadEarthquakelayer(earthquakedata) 
{
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	earthquakes = earthquakejson;
	// add the JSON layer onto the map
	earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
}