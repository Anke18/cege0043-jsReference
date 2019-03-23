function startD3GraphLoad(selecttype)
{

	//http://developer.cege.ucl.ac.uk:30312/getMyUsers/30312
	//http://developer.cege.ucl.ac.uk:30312/getAllUsers
	d3.selectAll("svg > *").remove(); 
	const	svg     = d3.select("svg"),
			margin  = {top: 20, right: 20, bottom: 30, left: 50},
			width   = +svg.attr("width")  - margin.left - margin.right,
			height  = +svg.attr("height") - margin.top  - margin.bottom,
			x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
			y       = d3.scaleLinear().rangeRound([height, 0]),
			g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
	
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	if(selecttype == 1)
	{
		url = url + "/getMyUsers/"+ httpPortNumber;
	}
	if(selecttype == 2)
	{
		url = url + "/getAllUsers";
	}
	d3.json(url).then(data => 
	{
		alert(url);
		data = data[0].array_to_json;
		alert(data.day);
		alert(data.questions_answered);
		x.domain(data.map(d => d.day));
		y.domain([0, d3.max(data, d => d.questions_answered)]);

		g.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis-y")
			.call(d3.axisLeft(y).ticks(10).tickSize(8));

		g.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", d => x(d.day))
			.attr("y", d => y(d.questions_answered))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.questions_answered));
	}).catch(err => 
	{
		svg.append("text")         
			.attr("y", 20)
			.attr("text-anchor", "left")  
			.style("font-size", "20px") 
			.style("font-weight", "bold")  
			.text(`Couldn't open the data file: "${err}".`);
	});
}