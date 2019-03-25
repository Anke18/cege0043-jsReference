/*-----------------------------------------------------------
  Code reference:
  Claire EllulCEGE0043: Web and Mobile GIS - Apps and Programming (18/19)
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