function startTopScorersLoad()
{
	//d3 Code adapted from: https://www.htmlgoodies.com/beyond/javascript/generate-a-bar-chart-with-d3.js.html -->
	
	window.location.hash = "#picid";
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber + "/getTop5";
	var container = d3.select("#top5scorer");
	//alert(url);
	d3.select("#top5scorer > *").remove(); 
	
	const	svg     = d3.select("svg"),
			margin  = {top: 20, right: 20, bottom: 30, left: 50},
			width   = +svg.attr("width")  - margin.left - margin.right,
			height  = +svg.attr("height") - margin.top  - margin.bottom,
			x       = d3.scaleBand().rangeRound([0, width]).padding(0.2),
			y       = d3.scaleLinear().rangeRound([height, 0]),
			g       = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

	d3.json(url).then(data => 
	{
		data = data[0].array_to_json;
		x.domain(data.map(d => d.port_id));
		y.domain([0, d3.max(data, d => d.num_questions)]);
	
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
			.attr("x", d => x(d.port_id))
			.attr("y", d => y(d.num_questions))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.num_questions));
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