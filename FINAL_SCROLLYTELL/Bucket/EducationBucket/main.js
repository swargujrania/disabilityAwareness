const ED_WIDTH = 1400,
  ED_HEIGHT = 1000;

const ED_BUCKET_WIDTH = 140;

//const ED_PEOPLE_UNIT = 50000;

let ed_units = [];
let ed_dataset;
let ed_buckets = [];
let ed_arcs = [];


let ed_done = false;

eduStart = () => {
  if (ed_done == false) {

    ed_svg = d3.select('#educationBucketSection')
      .append('svg');

    ed_svg.attr('width', ED_WIDTH)
      .attr('height', ED_HEIGHT)
      .attr('transform', `translate(${P_WIDTH/2 - 70}, 0)`);

    //add drop down
    ed_setDropdown();

    d3.json('./Bucket/EducationBucket/buckets.json').then(data => {
      ed_buckets = data;
      for (let bucket of data) {
        ed_svg.append('line')
          .attr('x1', bucket.x1)
          .attr('y1', bucket.y)
          .attr('x2', bucket.x2)
          .attr('y2', bucket.y)
          .style('stroke', '#798D8F')
          .style('stroke-width', 2);
        ed_svg.append('text')
          .text(bucket.label)
          .attr('x', bucket.x)
          .attr('y', bucket.y + 30)
          .style('text-anchor', 'middle')
          .style('stroke', '#798D8F')
          .attr('font-family', 'Avenir Next')
          .attr('font-size', '13');

        d3.json('./Bucket/EducationBucket/units.json').then(ed_units => {
          // visual elements
          ed_svg.selectAll('.eunit')
            .data(ed_units)
            .enter()
            .append('polyline')
            .attr('class', d => {
              if (d.status == "With a Disability") {
                return 'eunit dis_eunit';
              } else {
                return 'eunit reg_eunit';
              }
            })
            .attr('data-state', d => d.state)
            .attr("points", d => d.points_init)
            .attr("stroke", d => {
              return ed_getColor(d.status).stroke
            })
            .attr("fill", d => {
              return ed_getColor(d.status).fill
            });

          ed_svg.selectAll('.dis_eunit')
            .transition()
            .ease(d3.easePolyIn.exponent(8))
            .duration(900)
            .delay((d, i) => i * 6)
            .attr("points", d => d.points_final);

          setTimeout(function () {
            ed_dataChange();
          }, 3000);

          ed_svg.selectAll('.eunit')
            .on('click', d => {
              ed_resetColors();
              ed_highlightState(d.state);
            })

          // make pie charts
          setTimeout(function () {
            ed_drawPieCharts(ed_buckets, ed_svg);
          }, 3000);

          ed_done = true;
        });

      }
    });

  }
}

function ed_highlightState(state) {
  $('".dis_eunit[data-state=\'' + state + '\']"').attr('fill', '#49929F');
  $('".reg_eunit[data-state=\'' + state + '\']"').attr('fill', '#D5F0F0');
  $('#stateName').text(state);
  $('#ed_stateDropdown').val(state);
}

function ed_resetColors() {

  $('.dis_eunit').attr('fill', ed_getColor('With a Disability').fill);
  $('.dis_eunit').attr('stroke', ed_getColor('With a Disability').stroke);
  $('.reg_eunit').attr('fill', ed_getColor('No Disability').fill);
  $('.reg_eunit').attr('stroke', ed_getColor('No Disability').stroke);
}

function ed_getColor(status) {
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

ed_dataChange = () => {

  d3.select('#educationBucketSection')
    .selectAll('.reg_eunit')
    .transition()
    .ease(d3.easePolyIn.exponent(8))
    .duration(100)
    .delay((d, i) => i * 2)
    .attr("points", d => d.points_final);
}

function ed_drawPieCharts(ed_buckets, ed_svg) {
  d3.json('./Bucket/EducationBucket/arcs0.json').then(arc3 => {
    ed_arcs.push(arc3);
    d3.json('./Bucket/EducationBucket/arcs1.json').then(arc3 => {
      ed_arcs.push(arc3);
      d3.json('./Bucket/EducationBucket/arcs2.json').then(arc3 => {
        ed_arcs.push(arc3);
        console.log(ed_arcs);

        const radius = ED_BUCKET_WIDTH / 2 * 0.8;

        // making pie charts
        var pie = d3.pie()
          .sort(null)
          .value(d => d.value);

        var arcLabel = function () {
          return d3.arc().innerRadius(radius).outerRadius(radius);
        }

        var arc33 = d3.arc()
          .innerRadius(0)
          .outerRadius(ED_BUCKET_WIDTH / 2 - 1)

        for (i = 0; i < ed_arcs.length; i++) {

          var centerX = ed_buckets[i].x;
          var centerY = ed_buckets[i].y + 140;

          ed_svg.append("g")
            .attr('class', 'pie')
            .attr('transform', `translate(${ centerX }, ${ centerY })`)
            .attr("stroke", "#FED48B")
            .attr("opacity", 0)
            .selectAll("path")
            .data(ed_arcs[i])
            .join("path")
            .attr("fill", d => {
              console.log(d.data);
              if (d.data.key.endsWith('WithDis')) {
                return '#FFAC1D';
              } else {
                return '#FEF1D6';
              }
            })
            .attr("d", arc33)
            .append("title")
            .text(d => `${ d.data.key }: ${ d.data.value }`)

          ed_svg.append("g")
            .attr('class', 'pieLabel')
            .attr("opacity", 0)
            .attr('transform', `translate(${ centerX }, ${ centerY })`)
            .attr("font-family", "Avenir Next")
            .attr("font-size", 13)
            .attr("fill", '#798D8F')
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(ed_arcs[i])
            .join("text")
            .attr("transform", d => {
              if (d.data.key.endsWith('WithDis')) {
                return `translate(40,-80)`;
              } else {
                return `translate(10,+90)`;
              }
            })
            //translate(0,0)`)//${ arcLabel().centroid(d) })`)
            .call(text => text.append("tspan")
              .attr("y", "-0.4em")
              .attr("font-weight", "500")
              .text(d => {
                return d.data.key.endsWith('WithDis') ? 'With Disability' : 'Without Disability';
              }))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
              .attr("x", 0)
              .attr("y", "0.7em")
              .attr("fill-opacity", 0.7)
              .text(d => Math.trunc(d.data.value).toLocaleString()));


          //animation
          ed_svg.selectAll('.pie')
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .delay(i * 1000)
            .attr('opacity', 1);

          ed_svg.selectAll('.pieLabel')
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

function ed_setDropdown() {
  var dropDown = d3.select('#ed_stateDropdown')
    .style('position', 'relative');

  var stateList = ["All of United States", "Alaska", "Maine", "North Carolina", "Missouri", "Pennsylvania", "Michigan", "Nebraska", "Oregon", "Wyoming", "California", "Mississippi", "Connecticut", "Texas", "Idaho", "Maryland", "New Mexico", "Alabama", "Tennesee", "Vermont", "Nevada", "West Virginia", "Oklahoma", "Wisconsin", "Puerto Rico", "Kansas", "Virginia", "North Dakota", "New Jersey", "Ohio", "South Carolina", "Georgia", "Colorado", "Hawaii", "South Dakota", "Indiana", "Kentucky", "Louisiana", "Washington", "Illinois", "Iowa", "New Hampshire", "Rhode Island", "Arkansas", "Delaware", "Minnesota", "Montana", "Arizona", "Florida", "Massachusetts", "District of Columbia", "Utah", "New York"];
  dropDown.selectAll('option')
    .data(stateList)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => {
      return d == 'All of United States' ? '' : d
    });
  $('#ed_stateDropdown').on('change', function () {
    var state = $(this).find(':selected').text();
    if (state != 'All of United States') {
      ed_resetColors();
      ed_highlightState(state);
    }

  })

}