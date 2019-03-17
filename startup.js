/*-----------------------------------------------------------

Code for Version2 for Core Functionality2 (in process):

In order to differentiate two app:
+ autoQuestionset()
+ startupQuestions()
+ autoQuizset()
+ startupQuiz()
- trackAndCircle()
- startup()

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