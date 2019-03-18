/*-----------------------------------------------------------

Code for Version3 for Core Functionality3 (in process):



------------------------------------------------------------*/

// for questions app 
function autoQuestionset()
{
	getPort();
	loadW3HTML();
}

function startupQuestions()
{
	document.addEventListener('DOMContentLoaded',
	function(){autoQuestionset();}, false);
}

// for quiz app
function autoQuizset()
{
	getPort();
	trackLocation();
	loadW3HTML();
}

function startupQuiz()
{
	document.addEventListener('DOMContentLoaded',
	function(){autoQuizset();}, false);
}

function loadW3HTML()
{
	w3.includeHTML();
}