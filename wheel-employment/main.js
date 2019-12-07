var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var a, b;
const PEOPLE_UNIT = 50000;

let units = [];
let dataset;
let buckets = [];
var spokes;
var totalNumber = [];

start = () => {

  var svg = d3.select('#vis-container svg');
  var svgWidth = $('#vis-container .vis svg').width();
  var svgHeight = $('#vis-container .vis svg').height();

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

  var spokesData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];	// number of industry types

  var spoke_length = 250;
  // var spoke_x1 =  hub_cx + hub_r * Math.cos(d*2*Math.PI/spokesData.length);
  // var spoke_y1 = hub_cy - hub_r * Math.sin(d*2*Math.PI/spokesData.length);
  // var spoke_x2 = hub_cx + (hub_r + spoke_length)*Math.cos(d*2*Math.PI/spokesData.length);
  // var spoke_y2 = hub_cy - (hub_r + spoke_length)*Math.sin(d*2*Math.PI/spokesData.length);

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



  d3.csv('./industry2018.csv').then(data => {

    // compute total number
    var hundredpercent = data.filter(d => d.percentage == 100 && d.disabilityType == "Total Civilian Noninstitutionalized Population");
    hundredpercent.forEach(h => {
      totalNumber.push({ 'state': h.state, 'numbers': h.numbers });
    })

    data = data.filter(d => d.disabilityType != "Total Civilian Noninstitutionalized Population");

    let nestedData = d3.nest()
      .key(d => d.industry)
      .entries(data);

    //nestedData.splice(0, 1);
    nestedData.pop();

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
      .key(d => d.industry)
      .key(d => d.state)
      .entries(data);

    n2.pop();

    for (let k = 0; k < n2.length; k++) {

      let tempUnits = []
      let bracket = n2[k];

      bracket.values.forEach(item => {
        //with dis
        var disCount = +item.values.find(i => i.disabilityType == 'With a Disability').numbers;

        for (j = 0; j < Math.ceil(disCount / PEOPLE_UNIT); j++) {
          var disUnit = {
            'bracket': bracket.key,
            'status': "With a Disability",
            'state': item.key
          }
          tempUnits.push(disUnit)
        }

        //without dis
        var woDisCount = +item.values.find(i => i.disabilityType == 'No Disability').numbers;
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
      .append('circle')
      .attr('class', d => {
        return d.status == "With a Disability" ? 'unit dis_unit' : 'unit reg_unit';
      })
      .attr('transform', d => `translate(${ d.x },${ d.y })`)
      .attr('data-state', d => d.state)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 3)
      .attr('stroke', '#F2BDB6')
      .attr('fill', d => {
        if (d.status == "With a Disability") {
          return 'rgb(242,189,182)';
        } else {
          return 'white';
        }
      });

    svg.selectAll('.unit')
      .on('click', d => {
        resetColors();
        highlightState(d.state);
      })

    var outerCircle = wheel.append('circle')
      .attr('class', 'outerCircle')
      .attr('r', 4 * hub_r)
      .attr('cx', hub_cx)
      .attr('cy', hub_cy)
      .attr('fill', 'none')
      .attr('stroke', '#ccc');

    var start_x = hub_cx - 350;
    var start_y = hub_cy;
    var end_x = hub_cx + 350;
    var end_y = hub_cy;

  });
}


function highlightState(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', 'rgba(0,134,173, 1)');
  $('".dis_unit[data-state=\'' + state + '\']"').attr('stroke', 'rgba(0,134,173, 1)');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', 'white');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('stroke', 'rgba(0,134,173, 0.4)');

  $('#stateName').text(state);
  var total = totalNumber.find(t => t.state == state).numbers;
  $('#stateTotal').text(total);

}

function resetColors() {

  $('.dis_unit').attr('fill', 'rgb(242,189,182)');
  $('.dis_unit').attr('stroke', 'none');
  $('.reg_unit').attr('fill', 'white');
  $('.reg_unit').attr('stroke', '#F2BDB6');
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
  }
}













