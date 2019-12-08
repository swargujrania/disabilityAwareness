let stateWiseDataset = [];
let selectedStates = ["New York", "Georgia"];
let dataToShow = [];
let usaData;

let svg;

d3.json('data/censusDataWithLatLong.json').then(data => {
  svg = d3.select('body').append('svg');
  svg.attr('width', 500)
    .attr('height', 600);

  d3.csv('./data/linedata.csv').then(data => {
    usaData = data
    usaData.splice(1, 1);
    usaData.splice(2, 1);
    usaData.splice(3, 1);
    usaData.splice(4, 1);
  });

  for (let datum of data) {
    datum.percent = datum.with_a_disability / datum.total_population;
    datum.with_a_disability = +datum.with_a_disability;
    datum.total_population = +datum.total_population;
    datum.year = +datum.year;
  }

  stateWiseDataset = d3.nest()
    .key(d => d.state)
    .object(data);

  for (let selection of selectedStates) {
    let state = stateWiseDataset[selection];

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

  xScale = d3.scaleLinear()
    .domain([2010, 2018])
    .range([80, 320]);

  if (dataToShow.length > 0) {

    yScale = d3.scaleLinear()
      .domain([d3.min(dataToShow, d => d.min_count), d3.max(dataToShow, d => d.max_count)])
      .range([500, 100]);

    yScaleP = d3.scaleLinear()
      .domain([d3.min(dataToShow, d => d.min_percent), d3.max(dataToShow, d => d.max_percent)])
      .range([500, 100]);

    for (let state of dataToShow) {
      let data = stateWiseDataset[state.state];

      data.sort((a, b) => a.year - b.year);
      let stateClass = data[0].state.toLowerCase();
      stateClass = stateClass.replace(/\s/g, '');

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr('class', 'trendline ' + stateClass)
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => xScale(d.year))
          .y(d => yScale(d.with_a_disability))
        );

      svg.selectAll(stateClass)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', stateClass)
        .attr('class', 'dots')
        .style('fill', 'lightgrey')
        .attr('r', '5')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.with_a_disability));

    }
  } else {

    yScale = d3.scaleLinear()
      .domain([6965300, 210207000])
      .range([500, 100]);

    yScaleP = d3.scaleLinear()
      .domain([0.2, 0.1])
      .range([500, 100]);
    setTimeout(() => {
      svg.append("path")
        .datum(usaData)
        .attr("fill", "none")
        .attr('class', 'trendline')
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => xScale(d.year))
          .y(d => yScale(d.with_a_disability))
        );

      svg.selectAll('.dots')
        .data(usaData)
        .enter()
        .append('circle')
        .attr('class', 'dots')
        .style('fill', 'lightgrey')
        .attr('r', '5')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.with_a_disability));
    }, 1500);
  }
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

  svg.append('g')
    .call(xAxis)
    .attr('transform', 'translate(0,500)');

  yAxisLine = svg.append('g');

  yAxisLine.call(yAxis)
    .attr('transform', 'translate(50,0)');

  let option_count = svg.append('text')
    .text('Count')
    .attr('transform', 'translate(50, 60)')
    .on('click', changeToCount);

  let option_percent = svg.append('text')
    .attr('transform', 'translate(100, 60)')
    .text('Percent')
    .on('click', changeToPercent);

});

// d3.csv('./data/linedata.csv').then(data => {

//   xScale = d3.scaleLinear()
//     .domain([2010, 2018])
//     .range([80, 320]);

//   yScale = d3.scaleLinear()
//     .domain([d3.min(data, d => d.number) - 2000000, d3.max(data, d => d.number) + 1000000])
//     .range([600, 200]);

//   yScaleP = d3.scaleLinear()
//     .domain([0.10, 0.15])
//     .range([600, 200]);

//   xAxis = d3.axisBottom()
//     .scale(xScale)
//     .tickFormat(d3.format("d"));

//   yAxis = d3.axisLeft()
//     .scale(yScale)
//     .ticks(4)
//     .tickFormat(d3.format('~s'));

//   yAxisP = d3.axisLeft()
//     .scale(yScaleP)
//     .ticks(4)
//   // .tickFormat(d3.format('%'));

//   mainView = d3.select('#main')
//     .append('svg');

//   sideView = d3.select('#main')
//     .append('svg');

//   mainView.attr('class', 'col-lg-8')
//     .attr('height', 1000)
//     .style('background', 'pink');

//   sideView.attr('class', 'col-lg-4')
//     .attr('height', 1000)
//     .style('background', 'white');

//   sideView.append('g')
//     .call(xAxis)
//     .attr('transform', 'translate(0,600)');

//   let option_count = sideView.append('text')
//     .text('Count')
//     .attr('transform', 'translate(50, 100)')
//     .on('click', changeToCount);

//   let option_perccent = sideView.append('text')
//     .attr('transform', 'translate(100, 100)')
//     .text('Percent')
//     .on('click', changeToPercent);;

//   yAxisLine = sideView.append('g');

//   yAxisLine.call(yAxis)
//     .attr('transform', 'translate(50,0)');

//   sideView.append("path")
//     .attr('class', 'trendline')
//     .datum(dataset)
//     .attr("fill", "none")
//     .attr("stroke", "grey")
//     .attr("stroke-width", 1.5)
//     .attr("d", d3.line()
//       .x(d => xScale(d.year))
//       .y(d => yScale(d.number))
//     );

//   sideView.selectAll('.dots')
//     .data(dataset)
//     .enter()
//     .append('circle')
//     .attr('class', 'dots')
//     .style('fill', 'lightgrey')
//     .attr('r', '5')
//     .attr('cx', d => xScale(d.year))
//     .attr('cy', d => yScale(d.number));

// });

changeToPercent = () => {
  svg.selectAll('.dots')
    .transition()
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScaleP(d.percent));

  svg.selectAll('.trendline')
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
  svg.selectAll('.dots')
    .transition()
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScale(d.with_a_disability));

  svg.selectAll('.trendline')
    .transition()
    .attr("d", d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.with_a_disability))
    );

  yAxisLine
    .transition()
    .call(yAxis);
}