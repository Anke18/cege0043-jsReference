/*-----------------------------------------------------------
Code for Version3 for Core Functionality3 (in process)
It allow user test their questions and answers but won't send back and save their answer
------------------------------------------------------------*/
// create a variable that will hold the XMLHttpRequest()
var client;
var xhrQuestionData;
var questionLayer;

// for questions, get location
function onMapClick(e)
{
	// create a custom popup
	var popupLocation = L.popup();
	// location: e.latlng.lat, e.latlng.lng
	// e.latlng -> eg. LatLng(51.50009, -0.08748)
	popupLocation.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
	document.getElementById("latitude").value = e.latlng.lat;
	document.getElementById("longitude").value = e.latlng.lng;
}
// now add the click event detector to the map
mymap.on('click', onMapClick);

// here modify code for core functionality1
function startQuestionDataLoad()
{
	if(questionLayer != undefined) 
	{
		mymap.removeLayer(questionLayer);
	};
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
			+feature.properties.id + ");return false;'>Check Result</button>";
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>"+feature.properties.correct_answer+"</div>";
			htmlString = htmlString + "<div> Correct Answer: " + feature.properties["answer_" + feature.properties.correct_answer] +"</div>"; //eavl?
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
	var userSelected = false;
	for(var i=1; i < 5; i++)
	{
		if (document.getElementById(questionID+"_"+i).checked)
		{
			userSelected = true;
			answerSelected = i;
		}
		if((document.getElementById(questionID+"_"+i).checked) && (i == answer)) 
		{
			alert ("This is the right answer.");
			userSelected = true;
			correctAnswer = true;
		}
	}
	if(correctAnswer === false && userSelected === true)
	{
		// wrong
		alert("This is a wrong answer.");
	}
	if(userSelected === false)
	{
		// wrong
		alert("There is no answer!");
	}
}