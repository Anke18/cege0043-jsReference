/*-----------------------------------------------------------

Code for Version3 for Core Functionality3

------------------------------------------------------------*/

// for questions, get location
function onMapClick(e)
{
	// create a custom popup
	var popupLocation = L.popup();
	// location: e.latlng.lat, e.latlng.lng
	// e.latlng -> eg. LatLng(51.50009, -0.08748)
	popupLocation.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
}
// now add the click event detector to the map
mymap.on('click', onMapClick);

// create a variable that will hold the XMLHttpRequest()
var client;
var xhrQuestionData;
var questionLayer;

// here modify code for core functionality1
function startQuestionDataLoad()
{
	//alert("Port2 : " + httpPortNumber);
	xhrQuestionData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	url = url + "/getQuizPoints/"+ httpPortNumber;
	xhrQuestionData.open("GET", url, true);
	xhrQuestionData.onreadystatechange = questionDataResponse;
	xhrQuestionData.send();
}

function questionDataResponse()
{
	if (xhrQuestionData.readyState == 4)
	{
		// if data is ready, process the data
		var questionData = xhrQuestionData.responseText;
		loadQuestionData(questionData);
	}
}

// load points version 2
function loadQuestionData(questionData)
{
	// convert text to JSON
	var questionJSON = JSON.parse(questionData);
	// load the geoJSON questionLayer
	questionLayer = L.geoJson(questionJSON,
	{
		// create the quiz points
		pointToLayer: function(feature, latlng)
		{
			var htmlString = "<DIV id='popup'"+ feature.properties.id + "><h5>" +
			feature.properties.question_title + "</h5>";
			htmlString = "<br>" + htmlString + "<h6>"+feature.properties.question_text+"</h6>";
			
			htmlString = "<br>" + htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
			htmlString = htmlString + "<input type='radio' name='answer' id='"
			+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br><br>";
			
			htmlString = htmlString + "<button onclick='checkAnswer("
			+feature.properties.id + ");return false;'>Submit Answer</button>";
			
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>"+feature.properties.correct_answer+"</div>";
			htmlString = htmlString + "</div>";
			return L.marker(latlng).bindPopup(htmlString);
		},
	}).addTo(mymap);
	mymap.fitBounds(questionLayer.getBounds());
}

function checkAnswer(questionID) 
{
	// get the right answer from the hidden div
	var answer = document.getElementById("answer"+questionID).innerHTML;
	// check the question radio buttons
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
		// wrong
		alert("Better luck next time");
	}
}