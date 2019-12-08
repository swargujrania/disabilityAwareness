var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var a, b;
const PEOPLE_UNIT = 50000;

let units = [];
let dataset;
let buckets = [];
var spokes;
var totalNumber = [];

start = () => {


  var svg = d3.select('#vis-container svg')
  var svgWidth = $('#vis-container .vis svg').width();
  var svgHeight = $('#vis-container .vis svg').height();

  //add drop down
  setDropdown(svgWidth, svgHeight);

  var wheel = d3.select('svg')
    .append('g')
    .attr('class', 'wheel');

  wheel.append('text')
    .attr('id', 'stateName')
    .attr('transform', `translate(${ svgWidth / 2 - 30 }, ${ svgHeight / 2 + 50 })`)
    .text('');

  wheel.append('text')
    .attr('id', 'stateTotal')
    .attr('transform', `translate(${ svgWidth / 2 - 30 }, ${ svgHeight / 2 + 70 })`)
    .text('');

  var hub_r = 100;
  var hub_cx = svgWidth / 2;
  var hub_cy = svgHeight / 2 + margin.top / 2 + 10;

  var hub = wheel.append('circle')
    .attr('class', 'hub')
    .attr('r', hub_r)
    .attr('cx', hub_cx)
    .attr('cy', hub_cy)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');

  var spokesData = [1, 2, 3, 4, 5, 6, 7, 8, 9];	// number of CoWs

  var spoke_length = 250;

  spokes = wheel.selectAll('.spokes')
    .data(spokesData)
    .enter()
    .append("line")
    .attr('x1', function (d) {
      return hub_cx + hub_r * Math.cos(d * 2 * Math.PI / spokesData.length);	//spoke_x1
    })
    .attr('y1', function (d) {
      return hub_cy - hub_r * Math.sin(d * 2 * Math.PI / spokesData.length);	//spoke_y1
    })
    .attr('x2', function (d) {
      return hub_cx + (hub_r + spoke_length) * Math.cos(d * 2 * Math.PI / spokesData.length);	//spoke_x2
    })
    .attr('y2', function (d) {
      return hub_cy - (hub_r + spoke_length) * Math.sin(d * 2 * Math.PI / spokesData.length);	//spoke_y2
    })
    .attr('stroke', '#ccc');

  d3.csv('./classOfWorker2018.csv').then(data => {

    // compute total number
    var hundredpercent = data.filter(d => d.percentage == 100 && d.disabilityType == "Total Civilian Noninstitutionalized Population");
    hundredpercent.forEach(h => {
      totalNumber.push({ 'state': h.state, 'numbers': h.numbers });
    })

    data = data.filter(d => d.disabilityType != "Total Civilian Noninstitutionalized Population");

    let nestedData = d3.nest()
      .key(d => d.classOfWorker)
      .entries(data);

    nestedData.splice(0, 1);
    // nestedData.pop();

    dataset = nestedData;
    console.log(dataset);

    var prevTheta = 0;
    for (let i = 0; i < spokesData.length; i++) {
      let x1 = $($('.wheel > line')[i]).attr('x1');
      let x2 = $($('.wheel > line')[i]).attr('x2');
      let y1 = $($('.wheel > line')[i]).attr('y1');
      let y2 = $($('.wheel > line')[i]).attr('y2');
      let theta1 = prevTheta;
      let theta2 = (i + 1) * 2 * Math.PI / spokesData.length;
      let label = dataset[i].key;
      buckets[i] = new Bucket(x1, y1, x2, y2, theta1, theta2, label);
      prevTheta = theta2;
      //buckets[i].showLabel(svg);
    }

    var n2 = d3.nest()
      .key(d => d.classOfWorker)
      .key(d => d.state)
      .entries(data);
    n2.splice(0, 1);

    for (let k = 0; k < n2.length; k++) {
      let tempUnits = []
      let bracket = n2[k];

      bracket.values.forEach(item => {
        //with dis
        var disCount = +item.values.find(i => i.disabilityType == 'With a Disability').numbers;

        for (j = 0; j < Math.round(disCount / PEOPLE_UNIT); j++) {
          var disUnit = {
            'bracket': bracket.key,
            'status': "With a Disability",
            'state': item.key
          }
          tempUnits.push(disUnit)
        }

        //without dis
        var woDisCount = +item.values.find(i => i.disabilityType == 'No Disability').numbers;
        for (j = 0; j < Math.round(woDisCount) / PEOPLE_UNIT; j++) {
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

      let t = 7;
      let radius = hub_r + 3.5;
      let PrevAngle = Math.asin(t / (2 * radius)) + buckets[k].theta1;
      angle = PrevAngle;

      // with dis
      for (let i = 0; i < totalWithDis.length; i++) {

        let x = hub_cx + radius * Math.cos(angle);
        let y = hub_cy - radius * Math.sin(angle);
        angle += 2 * Math.asin(t / (2 * radius));
        if (angle > buckets[k].theta2) {
          radius += t;
          angle = Math.asin(t / (2 * radius)) + buckets[k].theta1;

        }

        let unit = new Unit(totalWithDis[i], x, y, angle);
        units.push(unit);

      }

      // without dis
      for (let i = 0; i < totalNoDis.length; i++) {

        let x = hub_cx + radius * Math.cos(angle);
        let y = hub_cy - radius * Math.sin(angle);
        angle += 2 * Math.asin(t / (2 * radius));
        if (angle > buckets[k].theta2) {
          radius += t;
          angle = Math.asin(t / (2 * radius)) + buckets[k].theta1;

        }

        let unit = new Unit(totalNoDis[i], x, y, angle);
        units.push(unit);

      }

    }

    svg.selectAll('.unit')
      .data(units)
      .enter()
      .append('polyline')
      .attr('class', d => {
        return d.status == "With a Disability" ? 'unit dis_unit' : 'unit reg_unit';
      })
      .attr('data-state', d => d.state)
      .attr("points", d => d.points_init)
      .attr("stroke", d => { return getColor(d.status).stroke })
      .attr("fill", d => { return getColor(d.status).fill });

      svg.selectAll('.unit')
        .transition()
        .ease(d3.easePolyIn.exponent(2))
        .duration(400)
        .delay((d, i) => i * 6)
        .attr("points", d => d.points_final);
        
    svg.selectAll('.unit')
      .on('click', d => {
        resetColors();
        highlightState(d.state);
      })

    // var outerCircle = wheel.append('circle')
    //   .attr('class', 'outerCircle')
    //   .attr('r', 4 * hub_r)
    //   .attr('cx', hub_cx)
    //   .attr('cy', hub_cy)
    //   .attr('fill', 'none')
    //   .attr('stroke', '#ccc');

    var start_x = hub_cx - 350;
    var start_y = hub_cy;
    var end_x = hub_cx + 350;
    var end_y = hub_cy;

    labels1 = ["workers", "business workers", "", "", "Local government", "Private not-for-profit", "Self-employed in  ", "Employee of private", "Private for-profit"];
    labels2 = ["Unpaid family", " not incorporated ", "workers", "workers", "workers", "wage and salary", "own incorporated", "company workers", "wage and salary"];
    labels3 = ["", "Self-employed in own", "Federal government", "State government", "", "workers", "business workers", "", "workers"];
    var outerCircleRadius1 = 4.1 * hub_r;
    var outerCircleRadius2 = 3.9 * hub_r;
    var outerCircleRadius3 = 3.7 * hub_r;
    var outerCircleRadius4 = 0.9 * hub_r;

    function polarToCartesian(centerX, centerY, radius, angleInRadians) {
      //var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
      var start, end, largeArcFlag, sweepFlag, extraAngle;
      extraAngle = 0;
      largeArcFlag = 0;

      if (endAngle > Math.PI) {
        largeArcFlag = 1;
        extraAngle = Math.PI;
      }
      sweepFlag = largeArcFlag;
      start = polarToCartesian(x, y, radius, endAngle + extraAngle);
      end = polarToCartesian(x, y, radius, startAngle + extraAngle);
      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
      var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
      ].join(" ");
      return d;
    }


    var arcs1 = svg.selectAll(".arcs")
      .data(buckets)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("id", function (d, i) { return "s" + i; })
      .attr("d", function (d, i) {
        return describeArc(hub_cx, hub_cy, outerCircleRadius1, d.theta1, d.theta2);
      })
      .style("stroke", "#AAAAAA")
      .attr("stroke-opacity", 0)
      .style("stroke-dasharray", "5,5")
    var arcs2 = svg.selectAll(".arcs")
      .data(buckets)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("id", function (d, i) { return "t" + i; })
      //.attr("id","huhue")
      // .attr("d", function(d,i) {
      //     return describeArc(d.x, d.y, d.r, 160, -160)
      // } );
      .attr("d", function (d, i) {
        return describeArc(hub_cx, hub_cy, outerCircleRadius2, d.theta1, d.theta2);
      })//"M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y)
      .style("stroke", "#AAAAAA")
      .attr("stroke-opacity", 0)
      .style("stroke-dasharray", "5,5");

    var arcs3 = svg.selectAll(".arcs")
      .data(buckets)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("id", function (d, i) { return "u" + i; })
      //.attr("id","huhue")
      // .attr("d", function(d,i) {
      //     return describeArc(d.x, d.y, d.r, 160, -160)
      // } );
      .attr("d", function (d, i) {
        return describeArc(hub_cx, hub_cy, outerCircleRadius3, d.theta1, d.theta2);
      })//"M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y)
      .style("stroke", "#AAAAAA")
      .attr("stroke-opacity", 0)
      .style("stroke-dasharray", "5,5");

      var arcs4 = svg.selectAll(".arcs")
      .data(buckets)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("id", function (d, i) { return "v" + i; })
      .attr("d", function (d, i) {
        return describeArc(hub_cx, hub_cy, outerCircleRadius4, d.theta1, d.theta2);
      })
      .style("stroke", "#AAAAAA")
      .attr("stroke-opacity", 0)
      .style("stroke-dasharray", "5,5");

    var textArc1 = svg.selectAll(".industryLabels")
      .data(labels1)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href", function (d, i) {
        return "#s" + i;
      })
      .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
      .text(function (d, i) { return d; });

    var textArc2 = svg.selectAll(".industryLabels")
      .data(labels2)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href", function (d, i) {
        return "#t" + i;
      })
      .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
      .text(function (d, i) { return d; });

    var textArc3 = svg.selectAll(".industryLabels")
      .data(labels3)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href", function (d, i) {
        return "#u" + i;
      })
      .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
      .text(function (d, i) { return d; });

      //draw percentage
    var dataForPercentage = d3.nest().key(d => d.classOfWorker).key(d => d.disabilityType).rollup(d => d3.sum(d, v => v.numbers)).entries(data);
    var p = [];

    //generate labels
    tempLabel = [];
    for (var i = 0; i < buckets.length; i++) {
      tempLabel[i] = buckets[i].label;
      console.log(tempLabel[i]);
    }
    tempLabel.reverse();

    tempLabel.forEach(t => {
      var o = { 'bucket': t };
      var iNeedThis = dataForPercentage.find(d => d.key == t);
      var total = iNeedThis.values[0].value + iNeedThis.values[1].value;
      o['percentage'] = (d3.format('.1f')(iNeedThis.values.find(x => x.key == 'With a Disability').value / total * 100)) + '%';
      p.push(o);
    })

    var textArc4 = svg.selectAll(".percentage")
      .data(p)
      .enter()
      .append("text")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "rgb(255,0,0, 0.7)")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href", function (d, i) {
        return "#v" + i;
      })
      .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
      .text(function (d, i) { return d.percentage; });

  });
}

function highlightState(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 1)');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 0.4)');
 

  $('#stateName').text(state);
  var total = totalNumber.find(t => t.state == state).numbers;
  $('#stateTotal').text(total);

  $('#stateDropdown').val(state);
}

function resetColors() {

  $('.dis_unit').attr('fill', getColor('With a Disability').fill);
  $('.dis_unit').attr('stroke', getColor('With a Disability').stroke);
  $('.reg_unit').attr('fill', getColor('No Disability').fill);
  $('.reg_unit').attr('stroke', getColor('No Disability').stroke);
}


function setDropdown(width, height) {
  var dropDown = d3.select('body').select('#stateDropdown')
    .style('position', 'relative');
  //.style('margin-left', width + 'px');
  //.style('margin-bottom', height/2 + 'px');

  var stateList = ["Select a state", "Alaska", "Maine", "North Carolina", "Missouri", "Pennsylvania", "Michigan", "Nebraska", "Oregon", "Wyoming", "California", "Mississippi", "Connecticut", "Texas", "Idaho", "Maryland", "New Mexico", "Alabama", "Tennesee", "Vermont", "Nevada", "West Virginia", "Oklahoma", "Wisconsin", "Puerto Rico", "Kansas", "Virginia", "North Dakota", "New Jersey", "Ohio", "South Carolina", "Georgia", "Colorado", "Hawaii", "South Dakota", "Indiana", "Kentucky", "Louisiana", "Washington", "Illinois", "Iowa", "New Hampshire", "Rhode Island", "Arkansas", "Delaware", "Minnesota", "Montana", "Arizona", "Florida", "Massachusetts", "District of Columbia", "Utah", "New York"];
  dropDown.selectAll('option')
    .data(stateList)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => { return d == 'Select a state' ? '' : d });
  $('#stateDropdown').on('change', function () {
    var state = $(this).find(':selected').text();
    if (state != 'Select a state') {
      resetColors();
      highlightState(state);
    }

  })

}

function getColor(status) {
  switch (status) {
    case 'With a Disability': return { 'fill': 'rgba(255,0,0,0.6)', 'stroke': 'white' };
    case 'No Disability': return { 'fill': 'rgba(255,0,0,0.1)', 'stroke': 'white' };
  }
}

class Bucket {
  constructor(x1, y1, x2, y2, theta1, theta2, label) {
    this.label = label;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.theta1 = theta1;
    this.theta2 = theta2;
  }
}

class Unit {
  constructor(unit, x, y, angle) {
    this.status = unit.status;
    this.state = unit.state;
    this.bracket = unit.bracket;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.points_init = `${ x - 4 },${ y - 1000 } ${ x - 2 },${ y - 3.5 - 1000 } ${ x + 2 },${ y - 3.5 - 1000 } ${ x + 4 },${ y - 1000 } ${ x + 2 },${ y + 3.5 - 1000 } ${ x - 2 },${ y + 3.5 - 1000 } ${ x - 4 },${ y - 1000 }`;
    this.points_final = `${ x - 4 },${ y } ${ x - 2 },${ y - 3.5 } ${ x + 2 },${ y - 3.5 } ${ x + 4 },${ y } ${ x + 2 },${ y + 3.5 } ${ x - 2 },${ y + 3.5 } ${ x - 4 },${ y }`;

  }
}













