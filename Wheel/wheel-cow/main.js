var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var a, b;
const PEOPLE_UNIT = 50000;

units_7 = [];

var hub_r_7;
var hub_cx_7;
var hub_cy_7;

let dataset_7;
let buckets_7 = [];
var spokes_7;
var tempLabel;
var totalNumber_7 = [];


start = () => {


  var svg = d3.select('#vis-container svg')
  var svgWidth = $('#vis-container .vis svg').width();
  var svgHeight = $('#vis-container .vis svg').height();

  //add drop down
  setDropdown_7(svgWidth, svgHeight);

  var spokesData = [1, 2, 3, 4, 5, 6, 7, 8, 9];	// number of CoWs
  var wheel = drawWheel_7(svgWidth, svgHeight, spokesData);

  hub_r_7 = wheel.r;
  hub_cx_7 = wheel.cx;
  hub_cy_7 = wheel.cy;

  d3.csv('./classOfWorker2018.csv').then(data => {

    // compute total number
    //totalNumber_7 = calculateTotal_7(data);

    data = data.filter(d => d.disabilityType != "Total Civilian Noninstitutionalized Population");

    let nestedData = d3.nest()
      .key(d => d.classOfWorker)
      .entries(data);

    nestedData.splice(0, 1);
    // nestedData.pop();

    dataset_7 = nestedData;
    buckets_7 = drawBuckets_7(dataset_7, spokesData);

    d3.json('wheelCowUnits.json').then(units => {
      units_7 = units;
      drawUnits_7(svg, units_7);
    })

    var start_x = hub_cx_7 - 350;
    var start_y = hub_cy_7;
    var end_x = hub_cx_7 + 350;
    var end_y = hub_cy_7;

    labels1 = ["workers", "business workers", "", "", "Local government", "Private not-for-profit", "Self-employed in  ", "Employee of private", "Private for-profit"];
    labels2 = ["Unpaid family", " not incorporated ", "workers", "workers", "workers", "wage and salary", "own incorporated", "company workers", "wage and salary"];
    labels3 = ["", "Self-employed in own", "Federal government", "State government", "", "workers", "business workers", "", "workers"];
    var outerCircleRadius1 = 4.1 * hub_r_7;
    var outerCircleRadius2 = 3.9 * hub_r_7;
    var outerCircleRadius3 = 3.7 * hub_r_7;
    var outerCircleRadius4 = 0.9 * hub_r_7;

    //arc1
    var arc1 = drawArc_7(svg, buckets_7, hub_cx_7, hub_cy_7, hub_r_7, 0);
    var arc2 = drawArc_7(svg, buckets_7, hub_cx_7, hub_cy_7, hub_r_7, 1);
    var arc3 = drawArc_7(svg, buckets_7, hub_cx_7, hub_cy_7, hub_r_7, 2);
    var arc4 = drawArc_7(svg, buckets_7, hub_cx_7, hub_cy_7, hub_r_7, 3);

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
    setTimeout(() => {

      pData = data;
      var dataForPercentage = d3.nest().key(d => d.classOfWorker).entries(pData);
      dataForPercentage.splice(0, 1);
      var p = [];

      //generate labels
      tempLabel = [];
      for (var i = 0; i < buckets_7.length; i++) {
        tempLabel[i] = buckets_7[i].label;
        console.log(tempLabel[i]);
      }
      tempLabel.reverse();

      tempLabel.forEach(t => {

        var o = { 'bucket': t };

        var total = $('.unit[data-bracket="' + t + '"]').length;
        var wD = $('.dis_unit[data-bracket="' + t + '"]').length;

        if (wD != 0) {
          o['percentage'] = d3.format('.2f')(wD / total * 100) + '%';
        }
        else {
          o['percentage'] = '< ' + d3.format('.2f')(1 / total * 100) + '%';
        }

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

    }, 3000);


  });
}

function drawArc_7(svg, buckets_7, hub_cx_7, hub_cy_7, hub_r, id) {

  var outerCircleRadius = [];
  outerCircleRadius.push(4.1 * hub_r);
  outerCircleRadius.push(3.9 * hub_r);
  outerCircleRadius.push(3.7 * hub_r);
  outerCircleRadius.push(0.9 * hub_r);

  var idArray = ['s', 't', 'u', 'v']

  svg.selectAll(".arcs")
    .data(buckets_7)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("id", function (d, i) { return idArray[id] + i; })
    .attr("d", function (d, i) {
      return describeArc_7(hub_cx_7, hub_cy_7, outerCircleRadius[id], d.theta1, d.theta2);
    })
    .style("stroke", "#AAAAAA")
    .attr("stroke-opacity", 0)
    .style("stroke-dasharray", "5,5");

}


function drawUnits_7(svg, units_7) {
  svg.selectAll('.unit')
    .data(units_7)
    .enter()
    .append('polyline')
    .attr('class', d => {
      return d.status == "With a Disability" ? 'unit dis_unit' : 'unit reg_unit';
    })
    .attr('data-state', d => d.state)
    .attr('data-disStat', d => d.status)
    .attr('data-bracket', d => d.bracket)
    .attr("points", d => d.points_final)
    .attr("stroke", d => { return getColor_7(d.status).stroke })
    .attr("fill", d => { return getColor_7(d.status).fill });

  svg.selectAll('.unit')
    .transition()
    .ease(d3.easePolyIn.exponent(2))
    .duration(400)
    .delay((d, i) => i * 6)
    .attr("points", d => d.points_final);


  svg.selectAll('.unit')
    .on('click', d => {
      resetColors_7();
      highlightState_7(d.state);
    })
}


function polarToCartesian_7(centerX, centerY, radius, angleInRadians) {
  //var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc_7(x, y, radius, startAngle, endAngle) {
  var start, end, largeArcFlag, sweepFlag, extraAngle;
  extraAngle = 0;
  largeArcFlag = 0;

  if (endAngle > Math.PI) {
    largeArcFlag = 1;
    extraAngle = Math.PI;
  }
  sweepFlag = largeArcFlag;
  start = polarToCartesian_7(x, y, radius, endAngle + extraAngle);
  end = polarToCartesian_7(x, y, radius, startAngle + extraAngle);
  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
  ].join(" ");
  return d;
}


function drawBuckets_7(dataset, spokesData) {

  var prevTheta = 0;
  for (let i = 0; i < spokesData.length; i++) {
    let x1 = $($('.wheel > line')[i]).attr('x1');
    let x2 = $($('.wheel > line')[i]).attr('x2');
    let y1 = $($('.wheel > line')[i]).attr('y1');
    let y2 = $($('.wheel > line')[i]).attr('y2');
    let theta1 = prevTheta;
    let theta2 = (i + 1) * 2 * Math.PI / spokesData.length;
    let label = dataset[i].key;
    buckets_7[i] = new Bucket(x1, y1, x2, y2, theta1, theta2, label);
    prevTheta = theta2;
  }

  return buckets_7;
}

// function calculateTotal_7(data) {
//   totalNumber_7 = [];
//   var hundredpercent = data.filter(d => d.percentage == 100 && d.disabilityType == "Total Civilian Noninstitutionalized Population");
//   hundredpercent.forEach(h => {
//     totalNumber_7.push({ 'state': h.state, 'numbers': h.numbers });
//   });
// }

function drawWheel_7(svgWidth, svgHeight, spokesData) {
  var wheel = d3.select('svg')
    .append('g')
    .attr('class', 'wheel');

  wheel.append('text')
    .attr('id', 'stateName')
    .attr('transform', `translate(${ svgWidth / 2 - 20 }, ${ svgHeight / 2 - 50 })`)
    .text('');

  wheel.append('text')
    .attr('id', 'stateTotal')
    .attr('transform', `translate(${ svgWidth / 2 - 20 }, ${ svgHeight / 2 - 30 })`)
    .text('');

  var hub_r = 100;
  var hub_cx = svgWidth / 2;
  var hub_cy = svgHeight / 2 + margin.top / 2 - 100;

  var hub = wheel.append('circle')
    .attr('class', 'hub')
    .attr('r', hub_r)
    .attr('cx', hub_cx)
    .attr('cy', hub_cy)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');


  var spoke_length = 250;

  spokes_7 = wheel.selectAll('.spokes')
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

  return { 'wheel': wheel, 'r': hub_r, 'cx': hub_cx, 'cy': hub_cy };// wheel;
}

function highlightState_7(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 1)');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 0.4)');


  $('#stateName').text(state);
  //var total = totalNumber_7.find(t => t.state == state).numbers;
  //$('#stateTotal').text(total);

  $('#stateDropdown').val(state);
}

function resetColors_7() {

  $('.dis_unit').attr('fill', getColor_7('With a Disability').fill);
  $('.dis_unit').attr('stroke', getColor_7('With a Disability').stroke);
  $('.reg_unit').attr('fill', getColor_7('No Disability').fill);
  $('.reg_unit').attr('stroke', getColor_7('No Disability').stroke);
}


function setDropdown_7(width, height) {
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
      resetColors_7();
      highlightState_7(state);
    }

  })

}

function getColor_7(status) {
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















