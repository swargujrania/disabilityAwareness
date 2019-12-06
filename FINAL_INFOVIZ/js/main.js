const HEIGHT = 800,
  WIDTH = 1200;

const PEOPLE_UNIT = 50000;

let units = [];
let dataset;
let buckets = [];

let done = false;

start = () => {

  if (done == false) {
    let svg = d3.select('#bucket-viz');

    svg.attr('height', HEIGHT)
      .attr('width', WIDTH);

    d3.csv('../data/earnings.csv').then(data => {
      let nestedData = d3.nest()
        .key(d => d.income_bracket)
        .entries(data);

      nestedData.splice(0, 1);
      nestedData.pop();

      dataset = nestedData;

      for (let i = 0; i < 7; i++) {
        let x = i * 150 + 80;
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
        .append("polyline")
        .attr('class', 'unit')
        .attr('class', d => {
          if (d.status == "With a Disability") {
            return 'dis_unit';
          } else {
            return 'reg_unit';
          }
        })
        .attr("points", d => d.points_init)
        .attr("stroke", "none")
        .attr("fill", d => {
          console.log(d.status);
          if (d.status == "With a Disability") {
            return "rgba(255,0,0,0.6)";
          } else {
            return "rgba(255,0,0,0.2)";
          }
        });

      svg.selectAll('.dis_unit')
        .transition()
        .ease(d3.easePolyIn.exponent(8))
        .duration(900)
        .delay((d, i) => i * 6)
        .attr("points", d => d.points_final);
    });

    // d3.json('../data/download.json').then(data => {
    //   d3.json('../data/buckets.json').then(buckets => {

    //     for (let bucket of buckets) {}

    //     let data_dis = [];
    //     let data_reg = [];

    //     for (let datum of data) {
    //       if (datum.status == "With a Disability") {
    //         data_dis.push(datum);
    //       } else {
    //         data_reg.push(datum);
    //       }
    //     }
    //   });
    // });

    done = true;
  }
}

dataChange = () => {

  d3.select('#bucket-viz')
    .selectAll('.reg_unit')
    .transition()
    .ease(d3.easePolyIn.exponent(8))
    .duration(100)
    .delay((d, i) => i * 2)
    .attr("points", d => d.points_final);
}