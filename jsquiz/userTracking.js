var userMarker;
var closestQuiz;

// it's important to note that this function only allow to show on the phone?
/*function trackLocation()
{
	alert('getting location');
	navigator.geolocation.getCurrentPosition(getPosition);
	//getDistanceFromMultiplePoints();
}*/

function trackLocation()
{
	if(navigator.geolocation)
	{
		navigator.geolocation.watchPosition(showPosition);
		navigator.geolocation.getCurrentPosition(getPosition);
		//alert("Loading Current Location");
	}
	else 
	{
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}
// this could be deleted
function getPosition(position)
{
	//alert('getting location2');
	var userPositionString = "User start location: " + "<br>Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude;
	document.getElementById("showLocation").innerHTML = userPositionString;
	mymap.setView([position.coords.latitude, position.coords.longitude], 18);
	//getDistance();
}

function showPosition(position)
{
	if (userMarker)
	{
		mymap.removeLayer(userMarker);
	}
	// remove old points everytime
	if(questionLayer != undefined) 
	{
		mymap.removeLayer(questionLayer);
	};
	var myMarker = L.AwesomeMarkers.icon({markerColor: 'pink'});
    userMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon:myMarker}).addTo(mymap);
	getDistanceFromMultiplePoints(position);
    //mymap.locate({setView: true, maxZoom: 16});
	//getDistance(); 
	//CF3 do not need
}

/*
function getDistance()
{
	alert('getting distance');
	navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
}*/


function getDistanceFromMultiplePoints(position)
{
	//alert("rrr "+rAnsweredQuiz.length);
	//alert('getting distance : '+position);
	//alert(questionJSON[0].features.length);
	var minDistance = 100000000000;
	closestQuiz = "";
	var count = 0;
	for(var i = 0; i < questionJSON[0].features.length; i++)
	{
		var obj = questionJSON[0].features[i];
		var check = false;
		//alert(obj.properties.id +" kkkk " +rAnsweredQuiz[i].question_id);
		for(var j=0;j<rAnsweredQuiz.length;j++)
		{
			if(obj.properties.id == rAnsweredQuiz[j].question_id)
			{
				check = true;
			}
		}
		if(check === false)
		{
			//alert(obj.properties.id +" kkkk " +rAnsweredQuiz[j].question_id);
			var distance = calculateDistance(position.coords.latitude,position.coords.longitude,
			obj.geometry.coordinates[1],obj.geometry.coordinates[0],'K');
			if (distance < minDistance)
			{
				minDistance = distance;
				closestQuiz = obj.properties.id;
				count = i;
				//alert('minDistance : '+minDistance);
			}
		}
	}
	loadQuestionData2(1);
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit)
{
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // degrees - radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// radius of the earth - 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // miles to nautical miles
	//alert("222 :" + dist);
	return dist;
}