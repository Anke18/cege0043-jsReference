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
}

/* C3 do not need...
function trackLocation()
{
	if(navigator.geolocation)
	{
		navigator.geolocation.watchPosition(showPosition);
		alert("Loading Current Location");
	}
	else 
	{
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}

function showPosition(position)
{
	if (userMarker)
	{
		mymap.removeLayer(userMarker);
	}
    userMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup("You are here!").openPopup();
    mymap.locate({setView: true, maxZoom: 16});
	getDistance(); 
	//CF3 do not need
}
*/

function getDistance()
{
	//alert('getting distance');
	navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
}

function getDistanceFromPoint(position)
{
	var lat = 51.524479;
	var lng = -0.133894;
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	//document.getElementById('showDistance').innerHTML = "Distance: " + distance;
	if (distance < 0.1) {alert('You are close to UCL!');}
}

function getDistanceFromMultiplePoints(position)
{
	var minDistance = 100000000000;
	var closestQuake = "";
	for(var i = 0; i < earthquakes.features.length; i++)
	{
		var obj = earthquakes.features[i];
		var distance = calculateDistance(position.coords.latitude,position.coords.longitude,
		obj.geometry.coordinates[0],obj.geometry.coordinates[1],'K');
		if (distance < minDistance)
		{
			minDistance = distance;
			closestQuake = obj.properties.place;
		}
	}
	alert("Earthquake: " + closestQuake + " is distance " + minDistance + "away");
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
	return dist;
}
