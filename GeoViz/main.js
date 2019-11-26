const PEOPLE_UNIT = 50000;

let disabilityStatus = {
    "WITH": "with_a_disability",
    "NO": "no_disability"
}

var svg = d3.select('#main').select("svg");

var path = d3.geoPath();


d3.json("https://d3js.org/us-10m.v1.json").then(data => {

    us = data;
    // console.log(us);

    // var path1 = path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
    // var path2 = path(topojson.mesh(us, us.objects.states, (a, b) => a !== b));
    // var path3 = path(topojson.feature(us, us.objects.nation));

    // // $('#path1').attr('d', path1);
    // $('#path2').attr('d', path2);
    // $('#path3').attr('d', path3);

    geoData = d3.json(
        'https://raw.githubusercontent.com/larsvers/map-store/master/us_mainland_geo.json'
    );

    // points = d3.json(
    //     'https://raw.githubusercontent.com/larsvers/data-store/master/farmers_markets_us.json'
    // );

    points = d3.json("finalData.json");


    // Promise.all([geoData, points]).then(res => {
    //     let [geoData, userData] = res;
    //     ready(geoData, userData);
    // });

});

function ready(geoData, userData) {

    //for 2018
    userData = userData.filter(p => p["year"] == "2010");

    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 1920 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    const svg = d3.select('#main')
        .append('svg')
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top})`);

    // Projection and path.
    projection = d3.geoAlbers().fitSize([width, height], geoData);
    geoPath = d3.geoPath().projection(projection);

    userData.forEach(site => {
        const coords = projection([+site.lng, +site.lat]);
        site.x = coords[0];
        site.y = coords[1];
    });



    svg.selectAll("circle")
    .data(userData)
    .enter()
    .append('circle')
 
    .attr('cx', function(d){ return d['x']; })
    .attr('cy', function(d){ return d['y']; })
    .attr('r', 5)
    .attr('fill', function(d){ return d.status == disabilityStatus.WITH ? getColorByState(d) : '#fff'})
    .attr('opacity', function(d){ return d.status == disabilityStatus.WITH ? 0.5 : 1 })
    .style('stroke', function(d){ return getColorByState(d)});



    // // Create a hexgrid generator.
    // const hexgrid = d3.hexgrid()
    //     .extent([width, height])
    //     .geography(geoData)
    //     .pathGenerator(geoPath)
    //     .projection(projection)
    //     .hexRadius(10)
    //     //.gridExtend(20);

    // // Instantiate the generator.
    // hex = hexgrid(userData);

    // // Create exponential colorScale.
    // const colourScale = d3
    //     .scaleSequential(function (t) {
    //         var tNew = Math.pow(t, 10);
    //         return d3.interpolateViridis(tNew);
    //     })
    //     .domain([...hex.grid.extentPointDensity].reverse());

    // // Draw the hexes.
    // svg
    //     .append('g')
    //     .selectAll('path')
    //     .data(hex.grid.layout)
    //     .enter()
    //     .append('path')
    //     .attr('d', hex.hexagon())
    //     .attr('transform', d => `translate(${d.x} ${d.y})`)
    //     .style(
    //         'fill', function(d){ return "#fff"} //'#fff' //d => (!d.pointDensity ? '#fff' : colourScale(d.pointDensity))
    //     )
    //     .style('stroke', '#000');
}

function getColorByState(obj) {
    switch (obj["state"]) {
        case "Georgia": return "blue";
        default: return "#f1856f";
    }
}


