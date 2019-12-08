d3.csv('./data/linedata.csv').then(usa => {
  d3.json('data/censusDataWithLatLong.json').then(data => {
    sideview = d3.select('#viz2').append('svg');
    sideview.attr('width', 500)
      .attr('height', 600);

    usaData = usa
    usaData.splice(1, 1);
    usaData.splice(2, 1);
    usaData.splice(3, 1);
    usaData.splice(4, 1);


    div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    for (let item of usaData) {
      item.year = +item.year;
      item.total = +item.total;
      item.with_a_disability = +item.with_a_disability;
      item.percent = +item.percent;
    }

    for (let datum of data) {
      datum.percent = datum.with_a_disability / datum.total_population;
      datum.with_a_disability = +datum.with_a_disability;
      datum.total_population = +datum.total_population;
      datum.year = +datum.year;
      datum.state = datum.state.toLowerCase();
    }

    stateWiseDataset = d3.nest()
      .key(d => d.state)
      .object(data);

    xScale = d3.scaleLinear()
      .domain([2010, 2018])
      .range([80, 320]);

    yScale = d3.scaleLinear()
      .domain([0, d3.max(usaData, d => d.total)])
      .range([500, 100]);

    yScaleP = d3.scaleLinear()
      .domain([0.1, 0.15])
      .range([500, 100]);

    xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(4)
      .tickFormat(d3.format("d"));

    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(4)
      .tickFormat(d3.format('~s'));

    yAxisP = d3.axisLeft()
      .scale(yScaleP)
      .ticks(4)
    // .tickFormat(d3.format('%'));

    sideview.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,500)');

    yAxisLine = sideview.append('g');

    yAxisLine.call(yAxis)
      .attr('transform', 'translate(50,0)');

    let option_count = sideview.append('text')
      .text('Count')
      .attr('transform', 'translate(50, 60)')
      .on('click', changeToCount);

    let option_percent = sideview.append('text')
      .attr('transform', 'translate(100, 60)')
      .text('Percent')
      .on('click', changeToPercent);

    sideview.append("path")
      .datum(usaData)
      .attr("fill", "none")
      .attr('class', 'trendline')
      .attr("stroke", "grey")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.with_a_disability))
      );

    sideview.selectAll('.dots')
      .data(usaData)
      .enter()
      .append('circle')
      .attr('class', 'dots')
      .style('fill', 'lightgrey')
      .attr('r', '5')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.with_a_disability))
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`People with Disablilty: ${d.with_a_disability} <br /> Percent: ${d.percent*100}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  });
});

changeView = (selectedStates) => {
  dataToShow = [];

  d3.selectAll('.trendline').remove();
  d3.selectAll('.dots').remove();

  for (let selection of selectedStates) {
    let state = stateWiseDataset[selection.toLowerCase()];

    let min_count = d3.min(state, d => d.with_a_disability);
    let max_count = d3.max(state, d => d.with_a_disability);
    let min_percent = d3.min(state, d => d.percent);
    let max_percent = d3.max(state, d => d.percent);

    let datum = {
      state: selection,
      min_count: min_count,
      max_count: max_count,
      min_percent: min_percent,
      max_percent: max_percent,
    }

    dataToShow.push(datum);
  }

  console.log(dataToShow);
  if (dataToShow.length > 0) {

    yScale = d3.scaleLinear()
      .domain([d3.min(dataToShow, d => d.min_count) / 2, d3.max(dataToShow, d => d.max_count) + 50000])
      .range([500, 100]);

    yScaleP = d3.scaleLinear()
      .domain([d3.min(dataToShow, d => d.min_percent) - 0.03, d3.max(dataToShow, d => d.max_percent) + 0.03])
      .range([500, 100]);

    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(4)
      .tickFormat(d3.format('~s'));

    yAxisP = d3.axisLeft()
      .scale(yScaleP)
      .ticks(4)
    // .tickFormat(d3.format('%'));

    for (let state of dataToShow) {
      let data = stateWiseDataset[state.state.toLowerCase()];

      data.sort((a, b) => a.year - b.year);
      let stateClass = data[0].state.toLowerCase();
      stateClass = stateClass.replace(/\s/g, '');

      sideview.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr('class', 'trendline ' + stateClass)
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => xScale(d.year))
          .y(d => yScale(d.with_a_disability))
        );

      sideview.selectAll(stateClass)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', stateClass)
        .attr('class', 'dots')
        .style('fill', 'lightgrey')
        .attr('r', '5')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.with_a_disability))
        .on("mouseover", function (d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(`People with Disablilty: ${d.with_a_disability} <br /> Percent: ${d.percent*100} <br /> State: ${d.state}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });;

    }
  } else {

    yScale = d3.scaleLinear()
      .domain([6965300, 210207000])
      .range([500, 100]);

    yScaleP = d3.scaleLinear()
      .domain([0.2, 0.1])
      .range([500, 100]);

    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(4)
      .tickFormat(d3.format('~s'));

    yAxisP = d3.axisLeft()
      .scale(yScaleP)
      .ticks(4)
    // .tickFormat(d3.format('%'));

    sideview.append("path")
      .datum(usaData)
      .attr("fill", "none")
      .attr('class', 'trendline')
      .attr("stroke", "grey")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.with_a_disability))
      );

    sideview.selectAll('.dots')
      .data(usaData)
      .enter()
      .append('circle')
      .attr('class', 'dots')
      .style('fill', 'lightgrey')
      .attr('r', '5')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.with_a_disability))
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`People with Disablilty: ${d.with_a_disability} <br /> Percent: ${d.percent * 100}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

  yAxisLine.call(yAxis)
    .attr('transform', 'translate(50,0)');
}

changeToPercent = () => {

  sideview.selectAll('.dots')
    .transition()
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScaleP(d.percent));

  sideview.selectAll('.trendline')
    .transition()
    .attr("d", d3.line()
      .x(d => xScale(d.year))
      .y(d => yScaleP(d.percent))
    );

  yAxisLine
    .transition()
    .call(yAxisP);
}

changeToCount = () => {

  sideview.selectAll('.dots')
    .transition()
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScale(d.with_a_disability));

  sideview.selectAll('.trendline')
    .transition()
    .attr("d", d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.with_a_disability))
    );

  yAxisLine
    .transition()
    .call(yAxis);
}