
var WIDTH = 2500
var HEIGHT = 2000



d3.json("topo2018.json").then(tilegram => {
    console.log(tilegram);

    tiles = topojson.feature(tilegram, tilegram.objects.tiles)
    var transform = d3.geoTransform({
        point: function (x, y) {
            this.stream.point(x, -y)
        }
    });



    var path = d3.geoPath().projection(transform);

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
        .attr('d', path)
        .attr('fill', '#fff')
        .attr('stroke', '#f1856f');

    d3.selectAll('.tiles')
        .on('mouseover', function (d) {
            $(this).attr('fill', 'red');
        })
        .on('mouseout', function (d) {
            $(this).attr('fill', '#fff');
        })
        .on('mousemove', function (d) {

        });

    // Build list of state codes
    var stateCodes = []
    tilegram.objects.tiles.geometries.forEach(function (geometry) {
        if (stateCodes.indexOf(geometry.properties.name) === -1) {
            stateCodes.push(geometry.properties.name)
        }
    })

    // Build merged geometry for each state
    var stateBorders = stateCodes.map(function (code) {
        return topojson.merge(
            tilegram,
            tilegram.objects.tiles.geometries.filter(function (geometry) {
                return geometry.properties.name === code
            })
        )
    })

    // Draw path
    g.selectAll('path.border')
        .data(stateBorders)
        .enter().append('path')
        .attr('d', path)
        .attr('class', 'border')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 4)



})



