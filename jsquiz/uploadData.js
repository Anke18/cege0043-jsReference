var client;

function startAnswerUpload(postAnswerString)
{
	alert(postAnswerString);
	processAnswerData(postAnswerString);
}

function processAnswerData(postAnswerString) 
{
	client = new XMLHttpRequest();
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/uploadAnswer";
	client.open('POST',url,true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = answerDataUploaded;
	client.send(postAnswerString);
}

function answerDataUploaded()
{
	if (client.readyState == 4)
	{
		alert("Your answer was submitted!");
		//document.getElementById("dataUploadResult").innerHTML = client.responseText;
	}
}