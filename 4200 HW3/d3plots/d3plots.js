
// Part 2.1 
// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function (data) {
  // Convert string values to numbers
  data.forEach(function (d) {
    d.Likes = +d.Likes;
  });

  // Define the dimensions and margins for the SVG
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3.select("#boxplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales for x and y axes
  // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
  // d3.min(data, d => d.Likes) to achieve the min value and 
  // d3.max(data, d => d.Likes) to achieve the max value
  // For the domain of the xscale, you can list all four platforms or use
  // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform
  // Add scales    
  const xScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Platform))])
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Likes)])
    .nice()
    .range([height, 0]);

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Platform");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .text("Number of Likes");


  const rollupFunction = function (groupData) {
    const values = groupData.map(d => d.Likes).sort(d3.ascending);
    const min = d3.min(values);
    const q1 = d3.quantile(values, 0.25);
    const median = d3.quantile(values, 0.5);
    const q3 = d3.quantile(values, 0.75);
    const max = d3.max(values);
    return { min, q1, median, q3, max };
  };

  // Groups the data by platform and calculate quartiles
  const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

  quantilesByGroups.forEach((quantiles, Platform) => {
    const x = xScale(Platform);
    const boxWidth = xScale.bandwidth();

    // Draw vertical lines
    svg.append("line")
      .attr("x1", x + boxWidth / 2)
      .attr("x2", x + boxWidth / 2)
      .attr("y1", yScale(quantiles.min))
      .attr("y2", yScale(quantiles.max))
      .attr("stroke", "black");

    // Draw box from q1 to q3
    svg.append("rect")
      .attr("x", x)
      .attr("y", yScale(quantiles.q3))
      .attr("width", boxWidth)
      .attr("height", yScale(quantiles.q1) - yScale(quantiles.q3))
      .attr("stroke", "black")
      .attr("fill", "green");

    // Draw median line
    svg.append("line")
      .attr("x1", x)
      .attr("x2", x + boxWidth)
      .attr("y1", yScale(quantiles.median))
      .attr("y2", yScale(quantiles.median))
      .attr("stroke", "black");

  });
});


// Part 2.2
// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function (data) {
  // Convert string values to numbers
  data.forEach(function (d) {
    d.AvgLikes = +d.AvgLikes;
  });

  // Define the dimensions and margins for the SVG
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3.select("#barplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define four scales
  // Scale x0 is for the platform, which divide the whole scale into 4 parts
  // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
  // Recommend to add more spaces for the y scale for the legend
  // Also need a color scale for the post type

  const x0 = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Platform))])
    .range([0, width])
    .padding(0.2);

  const x1 = d3.scaleBand()
    .domain([...new Set(data.map(d => d.PostType))])
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.AvgLikes)])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain([...new Set(data.map(d => d.PostType))])
    .range(["Red", "Green", "Blue"]);

  // Add scales x0 and y    
  // Add x-axis label
  // Add y-axis label

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  svg.append("g")
    .call(d3.axisLeft(y));


  // Group container for bars
  // Draw bars
  const barGroups = svg.selectAll(".bar-group")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  barGroups.append("rect")
    .attr("x", d => x1(d.PostType))
    .attr("y", d => y(d.AvgLikes))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.AvgLikes))
    .attr("fill", d => color(d.PostType));

  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 400}, ${margin.top})`);

  const types = [...new Set(data.map(d => d.PostType))];
  types.forEach((type, i) => {
    legend.append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(type));

    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 12)
      .text(type)
      .attr("alignment-baseline", "middle");
  });
});

// Part 2.3
// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime1.csv");


socialMediaTime.then(function (data) {
  data.sort((a, b) => a.Date - b.Date);

  // Convert string values to numbers
  data.forEach(function (d) {
    d.AvgLikes = +d.AvgLikes;
    d.Date = d3.timeParse("%-m/%-d/%Y")(d.Date); 
  });

  // Define the dimensions and margins for the SVG
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG container
  const svg = d3.select("#lineplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales for x and y axes  
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.AvgLikes)])
    .nice()
    .range([height, 0]);

  // Draw the axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-25)");

  svg.append("g").call(d3.axisLeft(yScale));

  // Add x-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Date");

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .text("Average Number of Likes");

  // Define the line function
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.AvgLikes))
    .curve(d3.curveNatural);

  // Draw the path (line) based on the data
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3)
    .attr("d", line);
});
