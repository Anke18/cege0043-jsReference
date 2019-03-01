var client;

function startDataUpload() 
{
	var name = document.getElementById("name").value;
	var surname = document.getElementById("surname").value;
	var module = document.getElementById("module").value;
	var postString = "name="+name+"&surname="+surname+"&module="+module;
	var checkString = "";
	for(var i=1;i<5;i++)
	{
		if (document.getElementById("check"+i).checked === true)
		{
			checkString = checkString + document.getElementById("check"+i).value + "||";
		}
	}
	postString = postString + "&modulelist=" + checkString;
	if (document.getElementById("morning").checked)
	{
		postString = postString + "&lecturetime=morning";
	}
	if (document.getElementById("afternoon").checked)
	{
		postString = postString + "&lecturetime=afternoon";
	}
	var language = document.getElementById("languageselectbox").value;
	postString = postString + "&language=" + language;
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	alert(postString);
	processData(postString);
}

function processData(postString)
{
	client = new XMLHttpRequest();
	client.open('POST','http://developer.cege.ucl.ac.uk:30312/reflectData',true);
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
