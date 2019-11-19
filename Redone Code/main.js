const WIDTH = 1400,
  HEIGHT = 650;

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
      .attr('transform', d => `translate(${d.x},-10)`)
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
      .attr('transform', d => `translate(${d.x},${d.y})`);
  });
}