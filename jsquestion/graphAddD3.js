function startD3GraphLoad(selecttype)
{
	//Code source: https://jsfiddle.net/354zw0d2/9/
	//http://developer.cege.ucl.ac.uk:30312/getMyUsers/30312
	//http://developer.cege.ucl.ac.uk:30312/getAllUsers
	
	var url = "http://developer.cege.ucl.ac.uk:"+ httpPortNumber;
	if(selecttype == 1)
	{
		url = url + "/getMyUsers/"+ httpPortNumber;
		var container = d3.select("#myusers");
		d3.select("#myusers > *").remove(); 
	}
	if(selecttype == 2)
	{
		url = url + "/getAllUsers";
		var container = d3.select("#allusers");
		d3.select("#allusers > *").remove(); 
	}
	
	var width = 400,
		height = 200,
		margin = {top: 30, right: 20, bottom: 30, left: 50},
		barPadding = .2,
		axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'};

	var svg = container
	   .append("svg")
	   .attr("width", width)
	   .attr("height", height)
	   .append("g")
	   .attr("transform", `translate(${margin.left},${margin.top})`);

	var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
	var xScale1 = d3.scaleBand();
	var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

	var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
	var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

	d3.json(url).then(data => 
	{
		
		alert(url);
		data = data[0].array_to_json;
		data = data.map(i => {i.day = i.day; return i;});
		//

		xScale0.domain(data.map(d => d.day));
		xScale1.domain(['questions_answered', 'questions_correct']).range([0, xScale0.bandwidth()]);
		yScale.domain([0, d3.max(data, d => d.questions_answered)]);
		
		var day = svg.selectAll(".day")
		  .data(data)
		  .enter().append("g")
		  .attr("class", "day")
		  .attr("transform", d => `translate(${xScale0(d.day)},0)`);

		/* Add questions_answered bars */
		day.selectAll(".bar.questions_answered")
		  .data(d => [d])
		  .enter()
		  .append("rect")
		  .attr("class", "bar questions_answered")
		  .attr("x", d => xScale1('questions_answered'))
		  .attr("y", d => yScale(d.questions_answered))
		  .attr("width", xScale1.bandwidth())
		  .attr("height", d => {
			return height - margin.top - margin.bottom - yScale(d.questions_answered)
		  });
		  
		/* Add questions_correct bars */
		day.selectAll(".bar.questions_correct")
		  .data(d => [d])
		  .enter()
		  .append("rect")
		  .attr("class", "bar questions_correct")
		  .style("fill","#FFEC8B")
		  .attr("x", d => xScale1('questions_correct'))
		  .attr("y", d => yScale(d.questions_correct))
		  .attr("width", xScale1.bandwidth())
		  .attr("height", d => {
			return height - margin.top - margin.bottom - yScale(d.questions_correct)
		  });
		 
		// Add the X Axis
		svg.append("g")
		   .attr("class", "x axis")
		   .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
		   .call(xAxis);

		// Add the Y Axis
		svg.append("g")
		   .attr("class", "y axis")
		   .call(yAxis); 
	}).catch(err => 
	{
		svg.append("text")         
			.attr("y", 20)
			.attr("text-anchor", "left")  
			.style("font-size", "8px") 
			.style("font-weight", "bold")  
			.text(`Couldn't open the data file: "${err}".`);
	});
}