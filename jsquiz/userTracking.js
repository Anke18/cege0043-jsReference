var userMarker;

// it's important to note that this function only allow to show on the phone?
function trackLocation()
{
	alert('getting location');
	navigator.geolocation.getCurrentPosition(getPosition);
}
	
function getPosition(position)
{
	var userPositionString = "User start location: " + "<br>Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude;
	document.getElementById("showLocation").innerHTML = userPositionString;
	getDistance();
}

function getDistance()
{
	alert('getting distance');
	navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
}

function getDistanceFromMultiplePoints(position)
{
	//alert('getting distance : '+position);
	//alert(questionJSON[0].features.length);
	var minDistance = 100000000000;
	var closestQuiz = "";
	var count = 0;
	for(var i = 0; i < questionJSON[0].features.length; i++)
	{
		var obj = questionJSON[0].features[i];
		//alert("ppp "+questionJSON[0].features[i]);
		//alert("geometry: "+" i :"+obj.geometry.coordinates[0]+" , "+obj.geometry.coordinates[1]);
		var distance = calculateDistance(position.coords.latitude,position.coords.longitude,
		obj.geometry.coordinates[1],obj.geometry.coordinates[0],'K');
		//alert("111 :" + i + " :" + distance);
		if (distance < minDistance)
		{
			minDistance = distance;
			closestQuiz = obj.properties.id;
			count = i;
			//alert('minDistance : '+minDistance);
		}
	}
	alert("Quiz: " + closestQuiz + " is distance " + minDistance + "away");
	//alert(count);
	//alert(questionLayer);
	//alert(questionLayer.features[count]);
	//questionLayer.openPopup();
	//alert(questionJSON[0].features[count].geometry.coordinates);
	//L.marker(questionJSON[0].features[count].geometry.coordinates).openPopup();
	//alert(questionJSON[0].features[count].properties.popupContent);
	//L.marker(latlng).bindPopup(htmlString);
	//marker.bindPopup(popupContent).openPopup();
	//if (questionJSON[0].features[count].properties && questionJSON[0].features[count].properties.popupContent)
	//{
	//	questionJSON[0].features[count].openPopup();
	//}
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
