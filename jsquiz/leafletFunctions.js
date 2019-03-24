/*-----------------------------------------------------------
Code for Version4 for AF1
------------------------------------------------------------*/
// create a variable that will hold the XMLHttpRequest()
var client;
var xhrQuestionData;
var xhrAnswerData;
var xhrRanking;
var questionLayer;
var questionJSON;
var xhrRAnswersData;
var xhrWAnswersData;
var rAnsweredQuiz;
var wAnsweredQuiz;

// here modify code for core functionality1
function startQuestionDataLoad()
{
	getRAnswerResults();
	getWAnswerResults();
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
		//alert("first");
		// if data is ready, process the data
		var questionData = xhrQuestionData.responseText;
		loadQuestionData1(questionData);
	}
}

//---------------------------------------------------------------
// get right answer results
function getRAnswerResults()
{
	xhrRAnswersData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + "/getUserCorrectAnswers/" + httpPortNumber;
	xhrRAnswersData.open("GET", url, true);
	xhrRAnswersData.onreadystatechange = rAnswerResponse;
	xhrRAnswersData.send();
}

function rAnswerResponse()
{
	if(xhrRAnswersData.readyState == 4)
	{
		// if data is ready, process the data
		var rAnswerData = xhrRAnswersData.responseText;
		var rAnswerJSON = JSON.parse(rAnswerData);
		rAnsweredQuiz = rAnswerJSON[0].array_to_json;
		//alert("rrr "+ rAnsweredQuiz.length);
		//loadQuestionData(latestQuestionsData, 2);
	}
}
//------------------------------------------------------------------
// get wrong answer results
function getWAnswerResults()
{
	xhrWAnswersData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + "/getUserWrongAnswers/" + httpPortNumber;
	xhrWAnswersData.open("GET", url, true);
	xhrWAnswersData.onreadystatechange = wAnswerResponse;
	xhrWAnswersData.send();
}

function wAnswerResponse()
{
	if(xhrWAnswersData.readyState == 4)
	{
		// if data is ready, process the data
		var wAnswerData = xhrWAnswersData.responseText;
		var wAnswerJSON = JSON.parse(wAnswerData);
		//loadQuestionData(latestQuestionsData, 2);
		wAnsweredQuiz = wAnswerJSON[0].array_to_json;
		//alert("www "+ wAnsweredQuiz.length);
	}
}
//----------------------------------------------------

// could only test on the phone, which makes it hard to debug
// have to apart the function to let the questionJSON to be used to get the closestQuiz, and send it back...(mad
function loadQuestionData1(questionData)
{
	questionJSON = JSON.parse(questionData);
	trackLocation();
	//navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
	//loadQuestionData2();//load in web?
}

function loadQuestionData2()
{
	var quizMarker,openMarker;
	var openSet;
	var MarkerRight = L.AwesomeMarkers.icon({markerColor: 'lightgreen'});
	var MarkerWorng = L.AwesomeMarkers.icon({markerColor: 'lightred'});
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
			
			for(var i=0;i<rAnsweredQuiz.length;i++)
			{
				if(feature.properties.id == rAnsweredQuiz[i].question_id)
				{
					//alert("got55555 " + feature.properties.id);
					//alert(feature.properties.id +" kk "+rAnsweredQuiz[i].question_id);
					htmlString = htmlString + "<div> Correct Answer: " + feature.properties["answer_" + feature.properties.correct_answer] +"</div>";
					htmlString = htmlString + "</div>";
					return quizMarker = L.marker(latlng, {icon:MarkerRight}).bindPopup(htmlString);
				}
			}

			htmlString = htmlString + "<button onclick='checkAnswer("+feature.properties.id+ 
			");return false;'>Submit Answer</button>";
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>"+feature.properties.correct_answer+"</div>";
			// add div to show upload answer results
			htmlString = htmlString + "<br/><div id=answerUploadResult> The result of the upload goes here </div>";
			//htmlString = htmlString + "<div id=answerCorrectResult> The count of the correct number goes here </div>";
			htmlString = htmlString + "</div>";

			for(var i=0;i<wAnsweredQuiz.length;i++)
			{
				if(feature.properties.id == wAnsweredQuiz[i].question_id)
				{
					//alert(feature.properties.id +" kk "+rAnsweredQuiz[i].question_id +" kk "+ closestQuiz);
					if(feature.properties.id == closestQuiz)
					{
						//alert("got11111 " + feature.properties.id);
						openSet = latlng;
						return openMarker = L.marker(latlng, {icon:MarkerWorng}).bindPopup(htmlString);
					}
					else
					{
						//alert("got2222 " + feature.properties.id);
						return quizMarker = L.marker(latlng, {icon:MarkerWorng}).bindPopup(htmlString);
					}
				}
			}
			//return L.marker(latlng).bindPopup(htmlString);
			//alert(closestQuiz+"kkk :" +feature.properties.id);
			if(feature.properties.id == closestQuiz)
			{
				//alert("got33333 " + feature.properties.id);
				openSet = latlng;
				return openMarker = L.marker(latlng).bindPopup(htmlString);
			}
			//L.marker(latlng).bindPopup(htmlString);
			else
			{
				//alert("got44444 " + feature.properties.id);
				return quizMarker = L.marker(latlng).bindPopup(htmlString);
			}
		},
	}).addTo(mymap);
	openMarker.openPopup();
	mymap.setView(openSet, 18);
	//mymap.fitBounds(questionLayer.getBounds());
	//mymap.setView(openSet, 16);
}

//This code for answer num
//
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
		//document.getElementById("answerCorrectResult").innerHTML = "You have correctly answered " + countNum +" questions!";
		alert("You have correctly answered " + countNum +" questions!");
	}
}
//---------------------------------
//This code for ranking
//[{"array_to_json":[{"rank":21}]}]
function startRankingLoad()
{
	xhrRanking = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	url = url + "/getRanking/"+ httpPortNumber;
	xhrRanking.open("GET", url, true);
	xhrRanking.onreadystatechange = rankResponse;
	xhrRanking.send();
}

function rankResponse()
{
	if(xhrRanking.readyState == 4)
	{
		// if data is ready, process the data
		var rankData = xhrRanking.responseText;
		var rankStr = rankData.substring(27);//[{"array_to_json":[{"rank":21}]}] delete frount
		var rankNum = parseInt(rankStr);//get number
		document.getElementById("rankResult").innerHTML = "You are ranked " + rankNum +" now!";
	}
}
//---------------------------------

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
		if(document.getElementById(questionID+"_"+i).checked)
		{
			userSelected = true;
			answerSelected = i;
		}
		if((document.getElementById(questionID+"_"+i).checked) && (i == answer))
		{
			alert ("Well done");
			userSelected = true;
			correctAnswer = true;
		}
	}
	if(correctAnswer === false && userSelected === true)
	{
		// wrong
		alert("Better luck next time");
	}
	// create answer string to send back
	var postAnswerString ="port_id="+httpPortNumber+"&question_id="+questionID+"&answer_selected="+answerSelected+"&correct_answer="+answer;
	
	if(userSelected === false)
	{
		// wrong
		alert("There is nothing to submit!");
	}
	else
	{
		alert("submit!");
		// uploadData.js for sending back answers
		startAnswerUpload(postAnswerString);
		// count number
		startAnswerDataLoad();
	}
}