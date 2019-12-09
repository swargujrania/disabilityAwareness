const ER_WIDTH = 1400,
  ER_HEIGHT = 1000;

const ER_BUCKET_WIDTH = 140;

let er_units = [];
let er_dataset;
let er_buckets = [];
let er_arcs = [];


let er_done = false;

erStart = () => {
  if (er_done == false) {

    er_svg = d3.select('#earningBucketSection').append('svg');

    er_svg.attr('width', ER_WIDTH)
      .attr('height', ER_HEIGHT);
    //.attr('transform', 'translate(100,200)');

    //add drop down
    er_setDropdown();

    d3.json('./Bucket/EarningsBucket/buckets.json').then(data => {
      er_buckets = data;
      for (let bucket of data) {
        er_svg.append('line')
          .attr('x1', bucket.x1)
          .attr('y1', bucket.y)
          .attr('x2', bucket.x2)
          .attr('y2', bucket.y)
          .style('stroke', '#798D8F')
          .style('stroke-width', 2);
        er_svg.append('text')
          .text(bucket.label)
          .attr('x', bucket.x)
          .attr('y', bucket.y + 30)
          .style('text-anchor', 'middle')
          .style('stroke', '#798D8F')
          .attr('font-family', 'Avenir Next');

        d3.json('./Bucket/EarningsBucket/units.json').then(er_units => {
          // visual elements
          er_svg.selectAll('.unit')
            .data(er_units)
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
              return er_getColor(d.status).stroke
            })
            .attr("fill", d => {
              return er_getColor(d.status).fill
            });

          er_svg.selectAll('.dis_unit')
            .transition()
            .ease(d3.easePolyIn.exponent(8))
            .duration(900)
            .delay((d, i) => i * 6)
            .attr("points", d => d.points_final);

          er_svg.selectAll('.unit')
            .on('click', d => {
              er_resetColors();
              er_highlightState(d.state);
            })

          er_done = true;
        });

      }
    });

  }
}

function er_highlightState(state) {
  $('".dis_unit[data-state=\'' + state + '\']"').attr('fill', '#49929F');
  $('".reg_unit[data-state=\'' + state + '\']"').attr('fill', '#D5F0F0');
  $('#stateName').text(state);
  $('#er_stateDropdown').val(state);
}

function er_resetColors() {

  $('.dis_unit').attr('fill', er_getColor('With a Disability').fill);
  $('.dis_unit').attr('stroke', er_getColor('With a Disability').stroke);
  $('.reg_unit').attr('fill', er_getColor('No Disability').fill);
  $('.reg_unit').attr('stroke', er_getColor('No Disability').stroke);
}

function er_getColor(status) {
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

er_dataChange = () => {

  d3.select('body')
    .selectAll('.reg_unit')
    .transition()
    .ease(d3.easePolyIn.exponent(8))
    .duration(100)
    .delay((d, i) => i * 2)
    .attr("points", d => d.points_final);
}

function er_drawPieCharts(er_buckets) {
  d3.json('./Bucket/EarningsBucket/arcs.json').then(arc => {
    er_arcs.push(arc);
    d3.json('./Bucket/EarningsBucket/arcs1.json').then(arc => {
      er_arcs.push(arc);
      d3.json('./Bucket/EarningsBucket/arcs2.json').then(arc => {
        er_arcs.push(arc);
        d3.json('./Bucket/EarningsBucket/arcs3.json').then(arc => {
          er_arcs.push(arc);
          d3.json('./Bucket/EarningsBucket/arcs4.json').then(arc => {
            er_arcs.push(arc);
            d3.json('./Bucket/EarningsBucket/arcs5.json').then(arc => {
              er_arcs.push(arc);
              d3.json('./Bucket/EarningsBucket/arcs6.json').then(arc => {
                er_arcs.push(arc);

                console.log(er_arcs);

                const radius = ER_BUCKET_WIDTH / 3;

                // making pie charts
                var pie = d3.pie()
                  .sort(null)
                  .value(d => d.value);

                var arcLabel = function () {
                  return d3.arc().innerRadius(radius).outerRadius(radius);
                }

                var arc1 = d3.arc()
                  .innerRadius(0)
                  .outerRadius(ER_BUCKET_WIDTH / 2 - 1)

                for (i = 0; i < er_arcs.length; i++) {

                  var centerX = er_buckets[i].x;
                  var centerY = er_buckets[i].y + 140;

                  er_svg.append("g")
                    .attr('class', 'pie')
                    .attr('transform', `translate(${ centerX }, ${ centerY })`)
                    .attr("stroke", "#FED48B")
                    .attr("opacity", 0)
                    .selectAll("path")
                    .data(er_arcs[i])
                    .join("path")
                    .attr("fill", d => {
                      if (d.data.key.endsWith('WithDis')) {
                        return '#FFAC1D';
                      } else {
                        return '#FEF1D6';
                      }
                    })
                    .attr("d", arc1)
                    .append("title")
                    .text(d => `${ d.data.key }: ${ d.data.value }`)

                  er_svg.append("g")
                    .attr('class', 'pieLabel')
                    .attr("opacity", 0)
                    .attr('transform', `translate(${ centerX }, ${ centerY })`)
                    .attr("font-family", "Avenir Next")
                    .attr("font-size", 13)
                    .attr("fill", '#798D8F')
                    .attr("text-anchor", "middle")
                    .selectAll("text")
                    .data(er_arcs[i])
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
                  er_svg.selectAll('.pie')
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(1000)
                    .delay(i * 1000)
                    .attr('opacity', 1);

                  er_svg.selectAll('.pieLabel')
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(1000)
                    .delay(i * 1000)
                    .attr('opacity', 1);

                }

              });
            });
          });
        });
      });
    });
  });
}

function er_setDropdown() {
  var dropDown = d3.select('body').select('#er_stateDropdown')
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
  $('#er_stateDropdown').on('change', function () {
    var state = $(this).find(':selected').text();
    if (state != 'All of United States') {
      er_resetColors();
      er_highlightState(state);
    }

  })

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