var client;

function startDataUpload()
{
	var check = true;
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
		postString = postString + "&correct_answer=1";
	}
	else if (document.getElementById("A2").checked)
	{
		postString = postString + "&correct_answer=2";
	}
	else if (document.getElementById("A3").checked)
	{
		postString = postString + "&correct_answer=3";
	}
	else if (document.getElementById("A4").checked)
	{
		postString = postString + "&correct_answer=4";
	}
	else
	{
		alert("234");
		check = false;
	}
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	
	if (check = false||question_title==null||question_text==null||answer_1==null||answer_2==null||answer_3==null||answer_4==null||latitude==null||longitude==null)
	{
		alert("Please fill all required fields");
		check = false;
	}
	else
	{
		alert("234123");
		processData(postString);
	}
	//alert(postString);
	//processData(postString);
}

function processData(postString) 
{
	alert("2343423424");
	client = new XMLHttpRequest();
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/uploadQuestion";
	client.open('POST',url,true);
	client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	client.onreadystatechange = dataUploaded;
	client.send(postString);
}

function dataUploaded()
{
	if (client.readyState == 4){
		document.getElementById("dataUploadResult").innerHTML = client.responseText;
	}
}
