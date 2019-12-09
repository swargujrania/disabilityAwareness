
const P_WIDTH = 1400,
  P_HEIGHT = 1000;

const P_BUCKET_WIDTH = 140;

const PEOPLE_UNIT = 50000;

let p_units = [];
let p_dataset;
let p_buckets = [];
let p_arcs = [];


let p_done = false;

pStart = () => {
  if (p_done == false) {

    p_svg = d3.select('body')
      .append('svg');

    p_svg.attr('width', P_WIDTH)
      .attr('height', P_HEIGHT);
    //.attr('transform', 'translate(100,200)');

    //add drop down
    p_setDropdown();

    d3.json('./buckets.json').then(data => {
      p_buckets = data;
      for (let bucket of data) {
        p_svg.append('line')
          .attr('x1', bucket.x1)
          .attr('y1', bucket.y)
          .attr('x2', bucket.x2)
          .attr('y2', bucket.y)
          .style('stroke', '#798D8F')
          .style('stroke-width', 2);
        p_svg.append('text')
          .text(bucket.label)
          .attr('x', bucket.x)
          .attr('y', bucket.y + 30)
          .style('text-anchor', 'middle')
          .style('stroke', '#798D8F')
          .attr("font-family", "Avenir Next");

        d3.json('./p_units.json').then(p_units => {
          // visual elements
          p_svg.selectAll('.unit')
            .data(p_units)
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
            .attr("stroke", d => {
              return getColor(d.status).stroke
            })
            .attr("fill", d => {
              return getColor(d.status).fill
            });

          p_svg.selectAll('.dis_unit')
            .transition()
            .ease(d3.easePolyIn.exponent(8))
            .duration(900)
            .delay((d, i) => i * 6)
            .attr("points", d => d.points_final);

          setTimeout(function () {
            dataChange();
          }, 3000);

          p_svg.selectAll('.unit')
            .on('click', d => {
              resetColors();
              highlightState(d.state);
            })

          // make pie charts
          setTimeout(function () {
            p_drawPieCharts(data, p_buckets, p_svg);
          }, 3000);

          p_done = true;
        });

      }
    });

  }
}

function highlightState(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', '#49929F');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', '#D5F0F0)');
  $('#stateName').text(state);
  $('#stateDropdown').val(state);
}

function resetColors() {

  $('.dis_unit').attr('fill', getColor('With a Disability').fill);
  $('.dis_unit').attr('stroke', getColor('With a Disability').stroke);
  $('.reg_unit').attr('fill', getColor('No Disability').fill);
  $('.reg_unit').attr('stroke', getColor('No Disability').stroke);
}

function getColor(status) {
  switch (status) {
    case 'With a Disability':
      return {
        'fill': '#FFAC1D', 'stroke': 'none'
      };
    case 'No Disability':
      return {
        'fill': '#FEF1D6', 'stroke': 'none'
      };
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

function p_drawPieCharts() {


  d3.json('./arcs0.json').then(arc => {
    p_arcs.push(arc);
    d3.json('./arcs1.json').then(arc => {
      p_arcs.push(arc);
      d3.json('./arcs2.json').then(arc => {
        p_arcs.push(arc);
        console.log(p_arcs);

        const radius = P_BUCKET_WIDTH / 2 * 0.8;

        // making pie charts
        var pie = d3.pie()
          .sort(null)
          .value(d => d.value);

        var arcLabel = function () {
          return d3.arc().innerRadius(radius).outerRadius(radius);
        }

        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(P_BUCKET_WIDTH / 2 - 1)

        for (i = 0; i < p_arcs.length; i++) {

          var centerX = p_buckets[i].x;
          var centerY = p_buckets[i].y + 225;

          p_svg.append("g")
            .attr('class', 'pie')
            .attr('transform', `translate(${ centerX }, ${ centerY })`)
            .attr("stroke", "#FED48B")
            .attr("opacity", 0)
            .selectAll("path")
            .data(p_arcs[i])
            .join("path")
            .attr("fill", d => {
              console.log(d.data);
              if (d.data.key.endsWith('WithDis')) {
                return '#FFAC1D';
              } else {
                return '#FEF1D6';
              }
            })
            .attr("d", arc)
            .append("title")
            .text(d => `${ d.data.key }: ${ d.data.value }`)

          p_svg.append("g")
            .attr('class', 'pieLabel')
            .attr("opacity", 0)
            .attr("font-family", "Avenir Next")
            .attr('transform', `translate(${ centerX}, ${ centerY })`)
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .attr("fill",'#4A4A4A')
            .selectAll("text")
            .data(p_arcs[i])
            .join("text")
            .attr("transform", d => `translate(${ arcLabel().centroid(d) })`)
            .call(text => text.append("tspan")
              .attr("y", "-0.4em")
              .attr("font-weight", "600")
              .text(d => {
                return d.data.key.endsWith('WithDis') ? 'With Disability' : 'Without Disability';
              }))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
              .attr("x", 0)
              .attr("y", "0.7em")
              .attr("fill-opacity", 0.7)
              .attr("fill",'#4A4A4A')
              .text(d => d.data.value.toLocaleString()));


          //animation
          p_svg.selectAll('.pie')
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .delay(i * 1000)
            .attr('opacity', 1);

          p_svg.selectAll('.pieLabel')
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .delay(i * 1000)
            .attr('opacity', 1);

        }
      });
    });
  });
}

function p_setDropdown() {
  var dropDown = d3.select('body').select('#stateDropdown')
    .style('position', 'relative')
    .style('margin-left', P_WIDTH + 'px');

  var stateList = ["Select a state", "Alaska", "Maine", "North Carolina", "Missouri", "Pennsylvania", "Michigan", "Nebraska", "Oregon", "Wyoming", "California", "Mississippi", "Connecticut", "Texas", "Idaho", "Maryland", "New Mexico", "Alabama", "Tennesee", "Vermont", "Nevada", "West Virginia", "Oklahoma", "Wisconsin", "Puerto Rico", "Kansas", "Virginia", "North Dakota", "New Jersey", "Ohio", "South Carolina", "Georgia", "Colorado", "Hawaii", "South Dakota", "Indiana", "Kentucky", "Louisiana", "Washington", "Illinois", "Iowa", "New Hampshire", "Rhode Island", "Arkansas", "Delaware", "Minnesota", "Montana", "Arizona", "Florida", "Massachusetts", "District of Columbia", "Utah", "New York"];
  dropDown.selectAll('option')
    .data(stateList)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => {
      return d == 'Select a state' ? '' : d
    });
  $('#p_stateDropdown').on('change', function () {
    var state = $(this).find(':selected').text();
    if (state != 'Select a state') {
      resetColors();
      highlightState(state);
    }

  })

}
