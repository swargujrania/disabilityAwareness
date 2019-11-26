
var WIDTH = 2500
var HEIGHT = 2000



d3.json("topo2018.json").then(tilegram => {
    console.log(tilegram);

    tiles = topojson.feature(tilegram, tilegram.objects.tiles)
    transform = d3.geoTransform({
        point: function (x, y) {
            this.stream.point(x, -y)
        }
    });


    // old code
    Dpath = d3.geoPath().projection(transform);

    const svg = d3.select('#main').append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    var g = svg.append('g')
        .attr('transform', 'translate(-400,' + 1300 + ')')

    g.selectAll('path')
        .data(tiles.features)
        .enter()
        .append('path')
        .attr('class', 'tiles')
        .attr('d', Dpath)
        .attr('fill', '#fff')
        .attr('stroke', '#f1856f')
        .attr('id', function (d) { return d.properties.name + '_path' });
    d3.selectAll('.tiles')
        .on('mouseover', function (d) {
            $(this).attr('fill', 'yellow');
        })
        .on('mouseout', function (d) {
            $(this).attr('fill', '#fff');
        })
        .on('mousemove', function (d) {

        });

    // // Build list of state codes
    // var stateCodes = []
    // tilegram.objects.tiles.geometries.forEach(function (geometry) {
    //     if (stateCodes.indexOf(geometry.properties.name) === -1) {
    //         stateCodes.push(geometry.properties.name)
    //     }
    // })

    // // Build merged geometry for each state
    // var stateBorders = stateCodes.map(function (code) {
    //     return topojson.merge(
    //         tilegram,
    //         tilegram.objects.tiles.geometries.filter(function (geometry) {
    //             return geometry.properties.name === code
    //         })
    //     )
    // })

    // // Draw path
    // g.selectAll('path.border')
    //     .data(stateBorders)
    //     .enter().append('path')
    //     .attr('d', path)
    //     .attr('class', 'border')
    //     .attr('fill', 'none')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 4)


    //new code
    //get coordinates individually
    Coordinates = tiles.features.map(t => t.geometry).map(u => u.coordinates).flat();

    g.selectAll('polyline')
        .data(Coordinates)
        .enter()
        .append('polyline')
        .attr('fill', '#fff')
        .attr('opacity', '0.1')
        .attr('stroke', 'none')
        .attr('points', d => {
            var x = "";
            //console.log(d);
            for (j = 0; j < 7; j++) {
                x += d[0][j][0] + ',' + (d[0][j][1] * (-1)) + ',';
            }


            return x.substring(0, x.length - 1);
        })
        .on('mouseover', function (d) {
            $(this).attr('fill', 'red');
            $(this).attr('opacity', '1');
        })
        .on('mouseout', function (d) {
            $(this).attr('fill', '#fff');
            $(this).attr('opacity', '0.1');
        })
        .on('mousemove', function (d) {

        });

})



