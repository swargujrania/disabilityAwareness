const WIDTH = 1400,
  HEIGHT = 1000;

const BUCKET_WIDTH = 140;

const PEOPLE_UNIT = 25000;

let units = [];
let dataset;
let buckets = [];

start = () => {

  let svg = d3.select('body')
    .append('svg');

  svg.attr('width', WIDTH)
    .attr('height', HEIGHT);

  d3.csv('./earnings.csv').then(data => {
    let nestedData = d3.nest()
      .key(d => d.income_bracket)
      .entries(data);

    nestedData.splice(0, 1);
    nestedData.pop();

    dataset = nestedData;
    console.log(dataset);

    for (let i = 0; i < 7; i++) {
      let x = 70 + i * 210;
      let w = 140;
      let label = dataset[i].key;
      buckets[i] = new Bucket(x, label, w);
      buckets[i].showBucket(svg);
      buckets[i].showLabel(svg);
    }

    for (let k = 0; k < dataset.length; k++) {
      let bracket = dataset[k];
      bracket.DisabilityCount = 0;
      bracket.WoDisabiltyCount = 0;
      for (let item of bracket.values) {
        if (item.dis_stat == "With a Disability") {
          bracket.DisabilityCount += +item.value;
        } else if (item.dis_stat == "No Disability") {
          bracket.WoDisabiltyCount += +item.value;
        }
      }
      bracket.DisabilityCount = Math.floor(bracket.DisabilityCount);
      bracket.WoDisabiltyCount = Math.floor(bracket.WoDisabiltyCount);

      let unit1 = {
        bracket: bracket.key,
        status: "With a Disability"
      }
      let unit2 = {
        bracket: bracket.key,
        status: "No Disability"
      }

      let x1 = buckets[k].x1;
      let x2 = buckets[k].x2;

      let prevX = x1;
      let prevY = buckets[k].y - 4;
      for (let i = 0; i < bracket.DisabilityCount / PEOPLE_UNIT; i++) {
        let x = prevX;
        let y = prevY;
        prevX += 8;
        if (prevX > x2) {
          prevX = x1;
          prevY = prevY - 8;
        }
        let unit = new Unit(unit1, x, y);
        units.push(unit);
      }
      for (let i = 0; i < bracket.WoDisabiltyCount / PEOPLE_UNIT; i++) {
        let x = prevX;
        let y = prevY;
        prevX += 8;
        if (prevX > x2) {
          prevX = x1;
          prevY = prevY - 8;
        }
        let unit = new Unit(unit2, x, y);
        units.push(unit);
      }

    }

    svg.selectAll('.unit')
      .data(units)
      .enter()
      .append('circle')
      .attr('class', 'unit')
      .attr('transform', d => `translate(${ d.x },-10)`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 4)
      .style('stroke', 'F2BDB6')
      .attr('fill', d => {
        if (d.status == "With a Disability") {
          return 'rgb(242,189,182)';
        } else {
          return 'white';
        }
      })

    svg.selectAll('.unit')
      .transition()
      .ease(d3.easePolyIn.exponent(8))
      .duration(1000)
      .delay((d, i) => i * 2)
      .attr('transform', d => `translate(${ d.x },${ d.y })`);


    // make pie charts
    drawPieCharts(dataset, buckets, svg);

  });


}

function drawPieCharts(dataset, buckets, svg) {

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

    pieData.push({ 'key': dataset[i].key + '_WithDis', 'value': dataset[i].DisabilityCount });
    pieData.push({ 'key': dataset[i].key + '_WithoutDis', 'value': dataset[i].WoDisabiltyCount });

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
      .text(d => `${ d.data.key }: ${ d.data.value.toLocaleString() }`)


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
      .ease(d3.easePolyIn.exponent(2))
      .duration(1000)
      .delay(i * 2000)
      .attr('opacity', 1);

    svg.selectAll('.pieLabel')
      .transition()
      .ease(d3.easePolyIn.exponent(2))
      .duration(1000)
      .delay(i * 2000)
      .attr('opacity', 1);

  }

}