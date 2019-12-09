stateCodes = [{
    "name": "Alabama",
    "abbreviation": "AL"
  },
  {
    "name": "Alaska",
    "abbreviation": "AK"
  },
  {
    "name": "American Samoa",
    "abbreviation": "AS"
  },
  {
    "name": "Arizona",
    "abbreviation": "AZ"
  },
  {
    "name": "Arkansas",
    "abbreviation": "AR"
  },
  {
    "name": "California",
    "abbreviation": "CA"
  },
  {
    "name": "Colorado",
    "abbreviation": "CO"
  },
  {
    "name": "Connecticut",
    "abbreviation": "CT"
  },
  {
    "name": "Delaware",
    "abbreviation": "DE"
  },
  {
    "name": "District Of Columbia",
    "abbreviation": "DC"
  },
  {
    "name": "Federated States Of Micronesia",
    "abbreviation": "FM"
  },
  {
    "name": "Florida",
    "abbreviation": "FL"
  },
  {
    "name": "Georgia",
    "abbreviation": "GA"
  },
  {
    "name": "Guam",
    "abbreviation": "GU"
  },
  {
    "name": "Hawaii",
    "abbreviation": "HI"
  },
  {
    "name": "Idaho",
    "abbreviation": "ID"
  },
  {
    "name": "Illinois",
    "abbreviation": "IL"
  },
  {
    "name": "Indiana",
    "abbreviation": "IN"
  },
  {
    "name": "Iowa",
    "abbreviation": "IA"
  },
  {
    "name": "Kansas",
    "abbreviation": "KS"
  },
  {
    "name": "Kentucky",
    "abbreviation": "KY"
  },
  {
    "name": "Louisiana",
    "abbreviation": "LA"
  },
  {
    "name": "Maine",
    "abbreviation": "ME"
  },
  {
    "name": "Marshall Islands",
    "abbreviation": "MH"
  },
  {
    "name": "Maryland",
    "abbreviation": "MD"
  },
  {
    "name": "Massachusetts",
    "abbreviation": "MA"
  },
  {
    "name": "Michigan",
    "abbreviation": "MI"
  },
  {
    "name": "Minnesota",
    "abbreviation": "MN"
  },
  {
    "name": "Mississippi",
    "abbreviation": "MS"
  },
  {
    "name": "Missouri",
    "abbreviation": "MO"
  },
  {
    "name": "Montana",
    "abbreviation": "MT"
  },
  {
    "name": "Nebraska",
    "abbreviation": "NE"
  },
  {
    "name": "Nevada",
    "abbreviation": "NV"
  },
  {
    "name": "New Hampshire",
    "abbreviation": "NH"
  },
  {
    "name": "New Jersey",
    "abbreviation": "NJ"
  },
  {
    "name": "New Mexico",
    "abbreviation": "NM"
  },
  {
    "name": "New York",
    "abbreviation": "NY"
  },
  {
    "name": "North Carolina",
    "abbreviation": "NC"
  },
  {
    "name": "North Dakota",
    "abbreviation": "ND"
  },
  {
    "name": "Northern Mariana Islands",
    "abbreviation": "MP"
  },
  {
    "name": "Ohio",
    "abbreviation": "OH"
  },
  {
    "name": "Oklahoma",
    "abbreviation": "OK"
  },
  {
    "name": "Oregon",
    "abbreviation": "OR"
  },
  {
    "name": "Palau",
    "abbreviation": "PW"
  },
  {
    "name": "Pennsylvania",
    "abbreviation": "PA"
  },
  {
    "name": "Puerto Rico",
    "abbreviation": "PR"
  },
  {
    "name": "Rhode Island",
    "abbreviation": "RI"
  },
  {
    "name": "South Carolina",
    "abbreviation": "SC"
  },
  {
    "name": "South Dakota",
    "abbreviation": "SD"
  },
  {
    "name": "Tennessee",
    "abbreviation": "TN"
  },
  {
    "name": "Texas",
    "abbreviation": "TX"
  },
  {
    "name": "Utah",
    "abbreviation": "UT"
  },
  {
    "name": "Vermont",
    "abbreviation": "VT"
  },
  {
    "name": "Virgin Islands",
    "abbreviation": "VI"
  },
  {
    "name": "Virginia",
    "abbreviation": "VA"
  },
  {
    "name": "Washington",
    "abbreviation": "WA"
  },
  {
    "name": "West Virginia",
    "abbreviation": "WV"
  },
  {
    "name": "Wisconsin",
    "abbreviation": "WI"
  },
  {
    "name": "Wyoming",
    "abbreviation": "WY"
  }
];

d3.csv('./data/linedata.csv').then(usa => {
  d3.json('data/censusDataWithLatLong.json').then(data => {
    sideview = d3.select('#viz2').append('svg');
    sideview.attr('width', 500)
      .attr('height', 600)
      .attr('transform', 'translate(100,0)');

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

    sideview.append('text')
      .text('Years')
      .attr('transform', `translate(170, 550)`);

    sideview.append('text')
      .text('Prevalence of People with Disability')
      .attr('transform', `translate(50, 25)`);

    sideview.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,500)');

    yAxisLine = sideview.append('g');

    yAxisLine.call(yAxis)
      .attr('transform', 'translate(50,0)');

    option_count = sideview.append('text')
      .text('Count')
      .attr('transform', 'translate(50, 60)')
      .on('click', changeToCount)
      .style('font-family', 'AvenirNext-DemiBold');

    option_percent = sideview.append('text')
      .attr('transform', 'translate(130, 60)')
      .text('Percent')
      .on('click', changeToPercent)
      .style('font-family', 'AvenirNext-DemiBold')
      .style('opacity', 0.5);

    sideview.append("path")
      .datum(usaData)
      .attr("fill", "none")
      .attr('class', 'trendline')
      .attr("stroke", "#FFAC1D")
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
      .style('fill', '#2794A1')
      .attr('r', '5')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.with_a_disability))
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`People with Disablilty: ${d3.format(',')(d.with_a_disability)} <br /><br /> Percent: ${d3.format('.2%')(d.percent)}`)
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
  d3.selectAll('.state-label').remove();

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
        .attr("stroke", "#FFAC1D")
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
        .style('fill', '#2794A1')
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
        });
    }

    sideview.selectAll('.state-label')
      .data(dataToShow)
      .enter()
      .append('text')
      .attr('class', 'state-label')
      .text(d => {
        let stateFound = stateCodes.find(a => {
          return a.name.toLowerCase() == d.state.toLowerCase();
        });
        return stateFound.abbreviation;
      })
      .attr('transform', d => `translate(${xScale(2019)}, ${yScale(stateWiseDataset[d.state.toLowerCase()][4].with_a_disability)})`);

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
      .attr("stroke", "#FFAC1D")
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
      .style('fill', '#2794A1')
      .attr('r', '5')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.with_a_disability))
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`People with Disablilty: ${d3.format(',')(d.with_a_disability)} <br /><br /> Percent: ${d3.format('.2%')(d.percent)}`)
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

  option_percent.style('opacity', 0.5);
  option_count.style('opacity', 1);
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

  sideview.selectAll('.state-label')
    .transition()
    .attr('transform', d => `translate(${xScale(2019)}, ${yScaleP(stateWiseDataset[d.state.toLowerCase()][4].percent)})`);

  yAxisLine
    .transition()
    .call(yAxisP);

  option_count.style('opacity', 0.5);

  option_percent.style('opacity', 1);
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

  sideview.selectAll('.state-label')
    .transition()
    .attr('transform', d => `translate(${xScale(2019)}, ${yScale(stateWiseDataset[d.state.toLowerCase()][4].with_a_disability)})`);

  option_percent.style('opacity', 0.5);
  option_count.style('opacity', 1);

  yAxisLine
    .transition()
    .call(yAxis);
}