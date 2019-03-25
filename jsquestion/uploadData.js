/*-----------------------------------------------------------
  Code reference:
  Claire EllulCEGE0043: Web and Mobile GIS - Apps and Programming (18/19)
------------------------------------------------------------*/

var client;
var postString;

function startDataUpload()
{
	var check = false;// make sure the correct_answer is checked
	var question_title = document.getElementById("question_title").value;
	var question_text = document.getElementById("question_text").value;
	var answer_1 = document.getElementById("answer_1").value;
	var answer_2 = document.getElementById("answer_2").value;
	var answer_3 = document.getElementById("answer_3").value;
	var answer_4 = document.getElementById("answer_4").value;
	
	var postString = "question_title="+question_title+"&question_text="+question_text;
	postString = postString+"&answer_1="+answer_1+"&answer_2="+answer_2+"&answer_3="+answer_3+"&answer_4="+answer_4;
	postString = postString + "&port_id=" + httpPortNumber;
	if (document.getElementById("A1").checked)
	{
		check = true;
		postString = postString + "&correct_answer=1";
	}
	if (document.getElementById("A2").checked)
	{
		check = true;
		postString = postString + "&correct_answer=2";
	}
	if (document.getElementById("A3").checked)
	{
		check = true;
		postString = postString + "&correct_answer=3";
	}
	if (document.getElementById("A4").checked)
	{
		check = true;
		postString = postString + "&correct_answer=4";
	}
	
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	// make sure all required fields were filled
	if (check == false||question_title==""||question_text==""||answer_1==""||answer_2==""||answer_3==""||answer_4==""||latitude==""||longitude=="")
	{
		alert("Please fill all required fields");
	}
	else
	{
		//alert(postString);// let user check again
		processData(postString);
	}
}

function processData(postString)
{
	client = new XMLHttpRequest();
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/uploadQuestion";
	client.open('POST',url,true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

function dataUploaded()
{
	if (client.readyState == 4)
	{
		document.getElementById("dataUploadResult").innerHTML = client.responseText;
	}
}
