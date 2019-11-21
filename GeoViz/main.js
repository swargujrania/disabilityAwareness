//project work

var svg = d3.select('#main').select("svg");

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json").then(data => {

    us = data;
    console.log(us);

    var path1 = path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
    var path2 = path(topojson.mesh(us, us.objects.states, (a, b) => a !== b));
    var path3 = path(topojson.feature(us, us.objects.nation));

    $('#path1').attr('d', path1);
    $('#path2').attr('d', path2);
    $('#path3').attr('d', path3);

    projectionA = d3.geo.albersUsa();



});



