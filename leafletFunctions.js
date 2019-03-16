/*-----------------------------------------------------------

Code for Version1(achieved Core Functionality1)

Use for loop to make the manually clicks points and show questions work...

------------------------------------------------------------*/


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

// load points version 1
function loadQuestionData(questionData)
{
	var questionJSON = JSON.parse(questionData);
	// store points and questions in markers
	var markers = [];
	// use i to count points
	var i;
	i = 0;
	L.geoJson(questionJSON,
	{
		// use point to layer to create the points
		pointToLayer: function(feature, latlng)
		{
			// modify htmlString to show questions, modify the fontsize, 5/6 seems to be suitable
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
			// a hidden element with the right answer
			htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>"+feature.properties.correct_answer+"</div>";
			htmlString = htmlString + "</div>";
			// store points
			markers[i] = new L.Marker(latlng, {Qinfor: htmlString});
			i = i + 1; // move to the next
		},
	});
	// add points in the map, add click function
	for(var j=0;j<i;j++)
	{
		markers[j].addTo(mymap);
		markers[j].on('click', pointClick);
	}
	// set view to UCL
	mymap.setView(new L.LatLng(51.525086, -0.132609), 16);
}

// Click function, click to show points questions
function pointClick(e) 
{
	var getPString = this.options.Qinfor;
	//alert(getPString);
	document.getElementById('showquestiontext').innerHTML = getPString;
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