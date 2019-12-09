var margin_6 = { top: 100, left: 100, bottom: 20, right: 100 };

const PEOPLE_UNIT_6 = 50000;

units_6 = [];

var hub_r_6;
var hub_cx_6;
var hub_cy_6;

let dataset_6;
let buckets_6 = [];
var spokes_6;
var totalNumber_6 = [];

empMainStart = () => {

  var svg = d3.select('#vis-container1 svg');
  var svgWidth = 1000; //$('#vis-container1 .vis svg').width();
  var svgHeight = 1000 ;//$('#vis-container1 .vis svg').height();

  //add drop down
  setDropdown(svgWidth, svgHeight);

  var spokesData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];	// number of industry types
  var wheel = drawWheel(svgWidth, svgHeight, spokesData);

  hub_r_6 = wheel.r;
  hub_cx_6 = wheel.cx;
  hub_cy_6 = wheel.cy;

  d3.csv('./industry2018.csv').then(data => {

    // compute total number
    //totalNumber_6 = calculateTotal(data);

    data = data.filter(d => d.disabilityType != "Total Civilian Noninstitutionalized Population");
    let nestedData = d3.nest()
      .key(d => d.industry)
      .entries(data);

    //nestedData.splice(0, 1);
    nestedData.pop();

    dataset_6 = nestedData;

    buckets_6 = drawBuckets(dataset_6, spokesData);

    d3.json('wheelEmploymentUnits.json').then(units => {
      units_6 = units;
      drawUnits(svg, units_6);
    })

    labels1 = ["Public administration", "administration)", "and food services", " social assistance", "and waste management services",
      "rental and leasing", "Information", "Transportation and ", "Retail trade", "Wholesale trade", "Manufacturing"
      , "Construction", "Agriculture, forestry,"];
    labels2 = ["", "(except public ", "recreation, and accommodation", "and health care and", "management, and administrative", "and real estate and", "", "warehousing, and utilities", "", "",
      "", "", "fishing and hunting,"];
    labels3 = ["", "Other services ", "Arts, entertainment, and  ", "Educational services, ", "Professional, scientific, and ", "Finance and insurance, ",
      "", "", "", "", "", "", "and mining"];
    var outerCircleRadius1 = 4.1 * hub_r_6;
    var outerCircleRadius2 = 3.9 * hub_r_6;
    var outerCircleRadius3 = 3.7 * hub_r_6;
    var outerCircleRadius4 = 0.9 * hub_r_6;

    var start_x = hub_cx_6 - 350;
    var start_y = hub_cy_6;
    var end_x = hub_cx_6 + 350;
    var end_y = hub_cy_6;

    //arc1
    var arc1 = drawArc(svg, buckets_6, hub_cx_6, hub_cy_6, hub_r_6, 0);
    var arc2 = drawArc(svg, buckets_6, hub_cx_6, hub_cy_6, hub_r_6, 1);
    var arc3 = drawArc(svg, buckets_6, hub_cx_6, hub_cy_6, hub_r_6, 2);
    var arc4 = drawArc(svg, buckets_6, hub_cx_6, hub_cy_6, hub_r_6, 3);

    setTimeout(() => {

      //text arcs
      var textArc1 = svg.selectAll(".industryLabelsEmp")
        .data(labels1)
        .enter()
        .append("text")
        .append("class", '.industryLabelsEmp')
        .style("font-family", "AvenirNext-Regular")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .append("textPath")        //append a textPath to the text element
        .attr("xlink:href", function (d, i) {
          return "#s" + i;
        })
        .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
        .text(function (d, i) { return d; });

      var textArc2 = svg.selectAll(".industryLabelsEmp")
        .data(labels2)
        .enter()
        .append("text")
        .append("class", '.industryLabelsEmp')
        .style("font-family", "AvenirNext-Regular")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .append("textPath")        //append a textPath to the text element
        .attr("xlink:href", function (d, i) {
          return "#t" + i;
        })
        .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
        .text(function (d, i) { return d; });

      var textArc3 = svg.selectAll(".industryLabelsEmp")
        .data(labels3)
        .enter()
        .append("text")
        .append("class", '.industryLabelsEmp')
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "AvenirNext-Regular")
        .append("textPath")        //append a textPath to the text element
        .attr("xlink:href", function (d, i) {
          return "#u" + i;
        })
        .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
        .text(function (d, i) { return d; });

    }, 2000);


    setTimeout(() => {

      var pData = data;
      var dataForPercentage = d3.nest().key(d => d.industry).entries(pData);
      dataForPercentage.splice(0, 1);
      var p = [];

      //generate labels
      var tempLabelA = [];
      for (var i = 0; i < buckets_6.length; i++) {
        tempLabelA[i] = buckets_6[i].label;
      }
      tempLabelA.reverse();

      tempLabelA.forEach(t => {

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
        .style("fill", "grey")
        .style("font-family", "AvenirNext-Regular")
        .append("textPath")        //append a textPath to the text element
        .attr("xlink:href", function (d, i) {
          return "#v" + i;
        })
        .attr("startOffset", function (d, i) { return "50%"; }) //place the text halfway on the arc
        .text(function (d, i) { return d.percentage; });

    }, 3000);

  }); //d3.csv end braces
}

function drawArc(svg, buckets_6, hub_cx_6, hub_cy_6, hub_r, id) {

  var outerCircleRadius = [];
  outerCircleRadius.push(4.1 * hub_r);
  outerCircleRadius.push(3.9 * hub_r);
  outerCircleRadius.push(3.7 * hub_r);
  outerCircleRadius.push(0.9 * hub_r);

  var idArray = ['s', 't', 'u', 'v']

  svg.selectAll(".arcs")
    .data(buckets_6)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("id", function (d, i) { return idArray[id] + i; })
    .attr("d", function (d, i) {
      return describeArc(hub_cx_6, hub_cy_6, outerCircleRadius[id], d.theta1, d.theta2);
    })
    .style("stroke", "#AAAAAA")
    .attr("stroke-opacity", 0)
    .style("stroke-dasharray", "5,5");

}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start, end, largeArcFlag, sweepFlag, extraAngle;
  extraAngle = 0;
  largeArcFlag = 0;

  if (endAngle > Math.PI) {
    largeArcFlag = 1;
    extraAngle = Math.PI;
    radius -= 10;
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


function drawUnits(svg, units_6) {
  svg.selectAll('.unit')
    .data(units_6)
    .enter()
    .append('polyline')
    .attr('class', d => {
      return d.status == "With a Disability" ? 'unit dis_unit' : 'unit reg_unit';
    })
    .attr('data-state', d => d.state)
    .attr('data-disStat', d => d.status)
    .attr('data-bracket', d => d.bracket)
    .attr("points", d => d.points_final)
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
}

function calculateTotal(data) {
  totalNumber_6 = [];
  var hundredpercent = data.filter(d => d.percentage == 100 && d.disabilityType == "Total Civilian Noninstitutionalized Population");
  hundredpercent.forEach(h => {
    totalNumber_6.push({ 'state': h.state, 'numbers': h.numbers });
  })

  return totalNumber_6
}

function drawBuckets(dataset, spokesData) {

  var prevTheta = 0;
  for (let i = 0; i < spokesData.length; i++) {
    let x1 = $($('.wheel > line')[i]).attr('x1');
    let x2 = $($('.wheel > line')[i]).attr('x2');
    let y1 = $($('.wheel > line')[i]).attr('y1');
    let y2 = $($('.wheel > line')[i]).attr('y2');
    let theta1 = prevTheta;
    let theta2 = (i + 1) * 2 * Math.PI / spokesData.length;
    let label = dataset[i].key;
    buckets_6[i] = new Bucket(x1, y1, x2, y2, theta1, theta2, label);
    prevTheta = theta2;
    //buckets_6[i].showLabel(svg);
  }

  return buckets_6;
}

function drawWheel(svgWidth, svgHeight, spokesData) {
  var wheel = d3.select('#vis-container1 .vis svg')
    .append('g')
    .attr('class', 'wheel');



  wheel.append('text')
    .attr('id', 'stateName')
    .attr('transform', `translate(${ svgWidth / 2 - 22 }, ${ svgHeight / 2 - 50 })`)
    .attr('margin', 'auto')
    .text('');

  wheel.append('text')
    .attr('id', 'stateTotal')
    .attr('transform', `translate(${ svgWidth / 2 - 20 }, ${ svgHeight / 2 - 30 })`)
    .text('');

  var hub_r = 100;
  var hub_cx = svgWidth / 2;
  var hub_cy = svgHeight / 2 + margin_6.top / 2 - 100;

  var hub = wheel.append('circle')
    .attr('class', 'hub')
    .attr('r', hub_r)
    .attr('cx', hub_cx)
    .attr('cy', hub_cy)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');


  var spoke_length = 250;

  spokes_6 = wheel.selectAll('.spokes')
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

function highlightState(state) {

  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', '#49929F');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', '#D5F0F0');


  $('#stateName').text(state);
  $('#stateName').css('font-family', 'AvenirNext-Regular');
  $('#stateName').css('text-align', 'center');

  // var total = totalNumber_6.find(t => t.state == state).numbers;
  // $('#stateTotal').text(total);


  $('#stateDropdown1').val(state);
}

function resetColors() {

  $('.dis_unit').attr('fill', getColor('With a Disability').fill);
  $('.dis_unit').attr('stroke', getColor('With a Disability').stroke);
  $('.reg_unit').attr('fill', getColor('No Disability').fill);
  $('.reg_unit').attr('stroke', getColor('No Disability').stroke);
}

function setDropdown(width, height) {
  var dropDown = d3.select('body').select('#stateDropdown1')
    .style('position', 'relative');

  var stateList = ["Select a state", "Alaska", "Maine", "North Carolina", "Missouri", "Pennsylvania", "Michigan", "Nebraska", "Oregon", "Wyoming", "California", "Mississippi", "Connecticut", "Texas", "Idaho", "Maryland", "New Mexico", "Alabama", "Tennesee", "Vermont", "Nevada", "West Virginia", "Oklahoma", "Wisconsin", "Puerto Rico", "Kansas", "Virginia", "North Dakota", "New Jersey", "Ohio", "South Carolina", "Georgia", "Colorado", "Hawaii", "South Dakota", "Indiana", "Kentucky", "Louisiana", "Washington", "Illinois", "Iowa", "New Hampshire", "Rhode Island", "Arkansas", "Delaware", "Minnesota", "Montana", "Arizona", "Florida", "Massachusetts", "District of Columbia", "Utah", "New York"];
  dropDown.selectAll('option')
    .data(stateList)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => { return d == 'Select a state' ? '' : d });
  $('#stateDropdown1').on('change', function () {
    var state = $(this).find(':selected').text();
    if (state != 'Select a state') {
      resetColors();
      highlightState(state);
    }

  })

}

function getColor(status) {
  switch (status) {
    case 'With a Disability': return { 'fill': '#FFAC1D', 'stroke': 'white' };
    case 'No Disability': return { 'fill': '#FFE5AE', 'stroke': 'white' };
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

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
  //var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}














