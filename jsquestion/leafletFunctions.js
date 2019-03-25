/*-----------------------------------------------------------
  Code reference:
  Claire EllulCEGE0043: Web and Mobile GIS - Apps and Programming (18/19)
  Leaflet Map: https://leafletjs.com/
------------------------------------------------------------*/
// create a variable that will hold the XMLHttpRequest()
var client;
var xhrQuestionData;
var xhrDQuestionSData;
var xhrLatestQuestionSData;
var questionLayer;
var allQuestionLayer;

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

// get difficult questions
function startDQuestionsLoad()
{
	window.location.hash = "#mapid";
	xhrDQuestionSData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber + "/getDifficultQuestions";
	xhrDQuestionSData.open("GET", url, true);
	xhrDQuestionSData.onreadystatechange = DQuestionsResponse;
	xhrDQuestionSData.send();
}

function DQuestionsResponse()
{
	if(xhrDQuestionSData.readyState == 4)
	{
		// if data is ready, process the data
		var dQuizData = xhrDQuestionSData.responseText;
		var dQuizJSON = JSON.parse(dQuizData);
		var dQuiz = dQuizJSON[0].array_to_json;
		var dQuestionString = "";
		for(var i=0;i<dQuiz.length;i++)
		{
			dQuestionString += "Question Setter: " + dQuiz[i].port_id + "\nQuestion Text: " + dQuiz[i].question_text;
			dQuestionString += "\nCorrect Answer: " + dQuiz[i]["answer_" + dQuiz[i].correct_answer]+"\n\n";
		}
		alert(dQuestionString);
	}
}

// show all latest questions 30312/getAllAddQuestions
function addAllLatestQuestions()
{
	window.location.hash = "#mapid";
	if(allQuestionLayer != undefined) 
	{
		mymap.removeLayer(allQuestionLayer);
	};
	xhrLatestQuestionSData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber + "/getAllAddQuestions";
	xhrLatestQuestionSData.open("GET", url, true);
	xhrLatestQuestionSData.onreadystatechange = latestQuestionsResponse;
	xhrLatestQuestionSData.send();
}

function moveAllLatestQuestions()
{
	window.location.hash = "#mapid";
	if(allQuestionLayer == undefined) 
	{
		alert("Nothing need to be hided yet!");
	};
	mymap.removeLayer(allQuestionLayer);
}

function latestQuestionsResponse()
{
	if(xhrLatestQuestionSData.readyState == 4)
	{
		// if data is ready, process the data
		var latestQuestionsData = xhrLatestQuestionSData.responseText;
		loadQuestionData(latestQuestionsData, 2);
	}
}

// here modify code for core functionality1
function startQuestionDataLoad()
{
	window.location.hash = "#mapid";
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
		loadQuestionData(questionData, 1);
	}
}

// load points version 2
function loadQuestionData(questionData, type)
{
	// convert text to JSON
	var questionJSON = JSON.parse(questionData);
	// load the geoJSON questionLayer
	var quizLayer = L.geoJson(questionJSON,
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
			if(type === 1)
			{
				return L.marker(latlng).bindPopup(htmlString);
			}
			if(type === 2)
			{
				var MarkerAll = L.AwesomeMarkers.icon({markerColor: 'lightblue'});
				return L.marker(latlng,{icon:MarkerAll}).bindPopup(htmlString);
			}
		},
	});
	if(type === 1)
	{
		questionLayer = quizLayer;
		questionLayer.addTo(mymap);
	}
	if(type === 2)
	{
		allQuestionLayer = quizLayer;
		allQuestionLayer.addTo(mymap);
	}
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