var xhrNode;

function callDivNodeJSChange()
{
	xhrNode = new XMLHttpRequest();
	var filename = document.getElementById("filename").value;
	var url = "http://developer.cege.ucl.ac.uk:" + httpPortNumber + '/' + filename;
	xhrNode.open("GET", url, true);
	xhrNode.onreadystatechange = processDivNodeJSChange;//no () here
	// I use chrome??
	//try{
	//	xhrNode.setRequestHeader("Content-Type", "application/x-www-formurlencoded");
	//}
	//catch(e) { }
	xhrNode.send();
}

function processDivNodeJSChange()
{
	if (xhrNode.readyState < 4) // while waiting response from server
		document.getElementById('ajaxtest').innerHTML = "Loading...";
	else if (xhrNode.readyState === 4)
	{
		// 4 = Response from server has been completely loaded
		if (xhrNode.status > 199 && xhrNode.status < 300)
		// http status between 200 to 299 are all successful
		document.getElementById('ajaxtest').innerHTML = xhrNode.responseText;
	}
}
