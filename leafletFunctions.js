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
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	url = url + "/getFormData/"+ httpPortNumber;
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
	// load the geoJSON layer
	formLayer = L.geoJson(formJSON,
	{
		// use point to layer to create the points
		pointToLayer: function(feature, latlng)
		{
			// in this case, we build an HTML DIV string
			// using the values in the data
			var htmlString = "<DIV id='popup'"+ feature.properties.id + "><h2>" +
			feature.properties.name + "</h2><br>";
			htmlString = htmlString + "<h3>"+feature.properties.surname + "</h3><br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_1'/>"+feature.properties.module+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_2'/>"+feature.properties.language+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_3'/>"+feature.properties.lecturetime+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_4'/>"+feature.properties.port_id+"<br>";
			htmlString = htmlString + "<button onclick='checkAnswer("
			+feature.properties.id + ");return false;'>Submit Answer</button>";
			// now include a hidden element with the answer
			// in this case the answer is alwasy the first choice
			// for the assignment this will of course vary - > can use feature.properties.correct_answer
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>1</div>";
			htmlString = htmlString + "</div>";
			return L.marker(latlng).bindPopup(htmlString);
		},
	}).addTo(mymap);
	mymap.fitBounds(formLayer.getBounds());
}

function checkAnswer(questionID) 
{
	// get the answer from the hidden div
	// NB - do this BEFORE you close the pop-up as when you close the pop-up the DIV is destroyed
	var answer = document.getElementById("answer"+questionID).innerHTML;
	// now check the question radio buttons
	var correctAnswer = false;
	var answerSelected = 0;
	for(var i=1; i < 5; i++) 
	{
		if (document.getElementById(questionID+"_"+i).checked)
		{
			answerSelected = i;
		}
		if((document.getElementById(questionID+"_"+i).checked) && (i == answer)) 
		{
			alert ("Well done");
			correctAnswer = true;
		}
	}
	if (correctAnswer === false)
	{
		// they didn't get it right
		alert("Better luck next time");
	}
	// now close the popup
	mymap.closePopup();
	// the code to upload the answer to the server would go here
	// call an AJAX routine using the data
	// the answerSelected variable holds the number of the answer
	// that the user picked
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