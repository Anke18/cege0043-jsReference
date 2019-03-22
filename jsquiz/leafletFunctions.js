/*-----------------------------------------------------------
Code for Version4 for AF1
------------------------------------------------------------*/
// create a variable that will hold the XMLHttpRequest()
var client;
var xhrQuestionData;
var xhrAnswerData;
var questionLayer;
var questionJSON;


// here modify code for core functionality1
function startQuestionDataLoad()
{
	// remove old points everytime
	if(questionLayer != undefined) 
	{
		mymap.removeLayer(questionLayer);
	};
	//questionLayer.clearLayers();
	//mymap.removeLayer(questionLayer);
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
	if(xhrQuestionData.readyState == 4)
	{
		// if data is ready, process the data
		var questionData = xhrQuestionData.responseText;
		loadQuestionData1(questionData);
	}
}

//-------------------------
function startAnswerDataLoad()
{
	xhrAnswerData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	url = url + "/getCorrectNum/"+ httpPortNumber;
	xhrAnswerData.open("GET", url, true);
	xhrAnswerData.onreadystatechange = answerDataResponse;
	xhrAnswerData.send();
}

function answerDataResponse()
{
	if(xhrAnswerData.readyState == 4)
	{
		// if data is ready, process the data
		var answerData = xhrAnswerData.responseText;
		var countStr = answerData.substring(36);//[{"array_to_json":[{"num_questions":2}]}] delete frount
		var countNum = parseInt(countStr);//get number
		document.getElementById("answerCorrectResult").innerHTML = "You have correctly answered " + countNum +" questions!";
	}
}

//----------------------

// could only test on the phone, which makes it hard to debug
// have to apart the function to let the questionJSON to be used to get the closestQuiz, and send it back...(mad
function loadQuestionData1(questionData)
{
	questionJSON = JSON.parse(questionData);
	navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
	loadQuestionData2();//load in web?
}

function loadQuestionData2()
{
	var quizMarker,openMarker;
	var openSet;
	//alert("kkk :"+closestQuiz);
	// getDistanceFromMultiplePoints();
	// load the geoJSON questionLayer
	questionLayer = L.geoJson(questionJSON,
	{
		// create the quiz points
		pointToLayer: function(feature, latlng)
		{
			var htmlString = "<DIV id='popup'"+ feature.properties.id + "><h5>" +
			feature.properties.question_title + "</h5>";
			htmlString = "<br>" + htmlString + "<h6>"+feature.properties.question_text+"</h6>";
			
			htmlString = "<br>" + htmlString + "<input type='radio' name='useranswer' id='"
			+feature.properties.id+"_1'/>"+feature.properties.answer_1+"<br>";
			htmlString = htmlString + "<input type='radio' name='useranswer' id='"
			+feature.properties.id+"_2'/>"+feature.properties.answer_2+"<br>";
			htmlString = htmlString + "<input type='radio' name='useranswer' id='"
			+feature.properties.id+"_3'/>"+feature.properties.answer_3+"<br>";
			htmlString = htmlString + "<input type='radio' name='useranswer' id='"
			+feature.properties.id+"_4'/>"+feature.properties.answer_4+"<br><br>";
			
			htmlString = htmlString + "<button onclick='checkAnswer("+feature.properties.id+ 
			");return false;'>Submit Answer</button>";
			
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>"+feature.properties.correct_answer+"</div>";
			// add div to show upload answer results
			htmlString = htmlString + "<br/><div id=answerUploadResult> The result of the upload goes here </div>";
			htmlString = htmlString + "<br/><div id=answerCorrectResult> The count of the correct number goes here </div>";
			htmlString = htmlString + "</div>";
			//return L.marker(latlng).bindPopup(htmlString);
			//alert(closestQuiz+"kkk :" +feature.properties.id);
			if(feature.properties.id == closestQuiz)
			{
				//alert(latlng);
				openSet = latlng;
				return openMarker = L.marker(latlng).bindPopup(htmlString);
			}
			//L.marker(latlng).bindPopup(htmlString);
			else
			{
				//alert("got222");
				return quizMarker = L.marker(latlng).bindPopup(htmlString);
			}
		},
	}).addTo(mymap);
	openMarker.openPopup();
	mymap.setView(openSet, 18);
	//mymap.fitBounds(questionLayer.getBounds());
	//mymap.setView(openSet, 16);
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
		if(document.getElementById(questionID+"_"+i).checked)
		{
			answerSelected = i;
		}
		if((document.getElementById(questionID+"_"+i).checked) && (i == answer))
		{
			alert ("Well done");
			correctAnswer = true;
		}
	}
	if(correctAnswer === false)
	{
		// wrong
		alert("Better luck next time");
	}
	// create answer string to send back
	var postAnswerString ="port_id="+httpPortNumber+"&question_id="+questionID+"&answer_selected="+answerSelected+"&correct_answer="+answer;
	
	/*change color test
	questionLayer.eachLayer(function(layer)
	{
		//alert(layer.feature.geometry.coordinates);
		if(layer.feature.properties.id == questionID && correctAnswer === true)
		{
			layer.closePopup();
			var MarkerRed = L.AwesomeMarkers.icon({markerColor: 'orange'});
			L.marker([layer.feature.geometry.coordinates[1],layer.feature.geometry.coordinates[0]], {icon:MarkerRed}).addTo(mymap);
		}
		if(layer.feature.properties.id == questionID && correctAnswer === false)
		{
			layer.closePopup();
			var MarkerPink = L.AwesomeMarkers.icon({markerColor: 'pink'});
			L.marker([layer.feature.geometry.coordinates[1],layer.feature.geometry.coordinates[0]], {icon:MarkerPink}).addTo(mymap);
		}
	});*/
	
	// uploadData.js for sending back answers
	startAnswerUpload(postAnswerString);
	// count number
	startAnswerDataLoad();
}