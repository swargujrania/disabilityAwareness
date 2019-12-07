const WIDTH = 1400,
  HEIGHT = 1000;

const BUCKET_WIDTH = 140;

const PEOPLE_UNIT = 50000;

let units = [];
let dataset;
let buckets = [];

let done = false;

start = () => {
  if (done == false) {

    let svg = d3.select('body')
      .append('svg');

    svg.attr('width', WIDTH)
      .attr('height', HEIGHT);



    d3.csv('./earnings.csv').then(data => {

      //remove total
      data = data.filter(d => d.dis_stat != "Total Civilian Noninstitutionalized Population");

      let nestedData = d3.nest()
        .key(d => d.income_bracket)
        .key(d => d.state)
        .entries(data);

      nestedData.splice(0, 1);
      nestedData.pop();

      dataset = nestedData;

      //add drop down
      var stateList = ["Alaska", "Maine", "North Carolina", "Missouri", "Pennsylvania", "Michigan", "Nebraska", "Oregon", "Wyoming", "California", "Mississippi", "Connecticut", "Texas", "Idaho", "Maryland", "New Mexico", "Alabama", "Tennesee", "Vermont", "Nevada", "West Virginia", "Oklahoma", "Wisconsin", "Puerto Rico", "Kansas", "Virginia", "North Dakota", "New Jersey", "Ohio", "South Carolina", "Georgia", "Colorado", "Hawaii", "South Dakota", "Indiana", "Kentucky", "Louisiana", "Washington", "Illinois", "Iowa", "New Hampshire", "Rhode Island", "Arkansas", "Delaware", "Minnesota", "Montana", "Arizona", "Florida", "Massachusetts", "District of Columbia", "Utah", "New York"];

      for (let i = 0; i < 7; i++) {
        let x = 70 + i * 210;
        let w = 140;
        let label = dataset[i].key;
        buckets[i] = new Bucket(x, label, w);
        buckets[i].showBucket(svg);
        buckets[i].showLabel(svg);
      }

      for (let k = 0; k < dataset.length; k++) {

        let tempUnits = []
        let bracket = dataset[k];

        bracket.values.forEach(item => {
          //with dis
          var disCount = item.values.find(i => i.dis_stat == 'With a Disability').value;

          for (j = 0; j < Math.ceil(disCount / PEOPLE_UNIT); j++) {
            var disUnit = {
              'bracket': bracket.key,
              'status': "With a Disability",
              'state': item.key
            }
            tempUnits.push(disUnit)
          }

          //without dis
          var woDisCount = item.values.find(i => i.dis_stat == 'No Disability').value;
          for (j = 0; j < Math.ceil(woDisCount / PEOPLE_UNIT); j++) {
            var disUnit = {
              'bracket': bracket.key,
              'status': "No Disability",
              'state': item.key
            }
            tempUnits.push(disUnit)
          }

        });

        var totalWithDis = tempUnits.filter(u => u.status == 'With a Disability');
        var totalNoDis = tempUnits.filter(u => u.status == 'No Disability');

        let x1 = buckets[k].x1;
        let x2 = buckets[k].x2;

        let prevX = x1;
        let prevY = buckets[k].y - 4;
        for (let i = 0; i < totalWithDis.length; i++) {
          let x = prevX;
          let y = prevY;
          prevX += 8;
          if (prevX > x2) {
            prevX = x1;
            prevY = prevY - 8;
          }
          let unit = new Unit(totalWithDis[i], x, y);
          units.push(unit);
        }
        for (let i = 0; i < totalNoDis.length; i++) {
          let x = prevX;
          let y = prevY;
          prevX += 8;
          if (prevX > x2) {
            prevX = x1;
            prevY = prevY - 8;
          }
          let unit = new Unit(totalNoDis[i], x, y);
          units.push(unit);
        }

      }

      svg.selectAll('.unit')
        .data(units)
        .enter()
        .append('polyline')
        .attr('class', d => {
          if (d.status == "With a Disability") {
            return 'unit dis_unit';
          } else {
            return 'unit reg_unit';
          }
        })
        .attr('data-state', d => d.state)
        .attr("points", d => d.points_init)
        .attr("stroke", d => { return getColor(d.status).stroke })
        .attr("fill", d => { return getColor(d.status).fill });

      svg.selectAll('.dis_unit')
        .transition()
        .ease(d3.easePolyIn.exponent(8))
        .duration(900)
        .delay((d, i) => i * 6)
        .attr("points", d => d.points_final);

      setTimeout(function () {
        dataChange();
      }, 3000);

      svg.selectAll('.unit')
        .on('click', d => {
          resetColors();
          highlightState(d.state);
        })

      // make pie charts
      setTimeout(function () {
        drawPieCharts(data, buckets, svg);
      }, 3000);

      done = true;


    });
  }


}

function highlightState(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 1)');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 0.4)');
  $('#stateName').text(state);

}

function resetColors() {

  $('.dis_unit').attr('fill', getColor('With a Disability').fill);
  $('.dis_unit').attr('stroke', getColor('With a Disability').stroke);
  $('.reg_unit').attr('fill', getColor('No Disability').fill);
  $('.reg_unit').attr('stroke', getColor('No Disability').stroke);
}

function getColor(status) {
  switch (status) {
    case 'With a Disability': return { 'fill': 'rgba(255,0,0,0.6)', 'stroke': 'none' };
    case 'No Disability': return { 'fill': 'rgba(255,0,0,0.1)', 'stroke': 'none' };
  }
}

dataChange = () => {

  d3.select('body')
    .selectAll('.reg_unit')
    .transition()
    .ease(d3.easePolyIn.exponent(8))
    .duration(100)
    .delay((d, i) => i * 2)
    .attr("points", d => d.points_final);
}

function drawPieCharts(data, buckets, svg) {

  let dataset = d3.nest()
    .key(d => d.income_bracket)
    .entries(data);

  dataset.splice(0, 1);
  dataset.pop();

  const radius = BUCKET_WIDTH / 2 * 0.8;

  // making pie charts
  var pie = d3.pie()
    .sort(null)
    .value(d => d.value);

  var arcLabel = function () {
    return d3.arc().innerRadius(radius).outerRadius(radius);
  }

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(BUCKET_WIDTH / 2 - 1)


  for (i = 0; i < dataset.length; i++) {
    var pieData = [];
    var label = dataset[i].key;

    var totalWithDis = dataset[i].values.filter(v => v.dis_stat == 'With a Disability');
    var disCount = 0;
    totalWithDis.forEach(x => { disCount += +x.value });

    var totalNoDis = dataset[i].values.filter(v => v.dis_stat == 'No Disability');
    var noCount = 0;
    totalNoDis.forEach(x => { noCount += +x.value });

    pieData.push({ 'key': dataset[i].key + '_WithDis', 'value': disCount });
    pieData.push({ 'key': dataset[i].key + '_WithoutDis', 'value': noCount });

    var arcs = pie(pieData);

    var centerX = buckets[i].x;
    var centerY = buckets[i].y + 125;

    svg.append("g")
      .attr('class', 'pie')
      .attr('transform', `translate(${ centerX }, ${ centerY })`)
      .attr("stroke", "rgba(242,189,182, 0.5)")
      .attr("opacity", 0)
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => {
        if (d.data.key.endsWith('WithDis')) {
          return 'rgb(242,189,182)';
        }
        else {
          return 'rgba(242,189,182, 0.2)';
        }
      })
      .attr("d", arc)
      .append("title")
      .text(d => `${ d.data.key }: ${ d.data.value }`)


    svg.append("g")
      .attr('class', 'pieLabel')
      .attr("opacity", 0)
      .attr('transform', `translate(${ centerX }, ${ centerY })`)
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${ arcLabel().centroid(d) })`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => {
          return d.data.key.endsWith('WithDis') ? 'With Disability' : 'Without Disability';
        }))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));


    //animation
    svg.selectAll('.pie')
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .delay(i * 1000)
      .attr('opacity', 1);

    svg.selectAll('.pieLabel')
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .delay(i * 1000)
      .attr('opacity', 1);

  }

}