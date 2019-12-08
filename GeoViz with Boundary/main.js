var WIDTH = 2500
var HEIGHT = 2000

$('#stateName').css('left', WIDTH / 2);

selectedStates = [];

$(function () {

    d3.json("data/topo2018.json").then(tilegram => {
        // old code 
        tiles = topojson.feature(tilegram, tilegram.objects.tiles)
        transform = d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x, -y)
            }
        });

        Dpath = d3.geoPath().projection(transform);

        //draw svg area
        const svg = d3.select('#vis1').append("svg")
            .attr('width', WIDTH)
            .attr('height', HEIGHT)

        var g = svg.append('g')
            .attr('transform', 'translate(-400,' + 1300 + ')');

        //draw hex-grid
        Coordinates = tiles.features.map(t => t.geometry).map(u => u.coordinates).flat();
        hexUnitArray = [];
        tiles.features.forEach(element => {
            var hexCoordinateArray = element.geometry.coordinates;

            hexCoordinateArray = hexCoordinateArray.sort(function (x, y) {
                return y[0][0][1] - x[0][0][1];
            })

            hexCoordinateArray.forEach((hexCoordinate, index) => {

                var hexUnit = {
                    'stateId': element.id,
                    'elementId': '',
                    'state': element.properties.name,
                    'points': ''
                }
                var point = '';

                for (i = 0; i < hexCoordinate[0].length; i++) {
                    point += hexCoordinate[0][i][0] + ',' + (hexCoordinate[0][i][1] * (-1)) + ','
                }

                hexUnit.points = point.substring(0, point.length - 1);
                hexUnit.elementId = index;

                hexUnitArray.push(hexUnit);

            })
        });

        d3.csv('./2018.csv').then(data => {
            for (let datum of data) {
                datum.count = 0;
            }
            for (let item of hexUnitArray) {
                for (let datum of data) {
                    if (datum.state.toLowerCase() == item.state.toLowerCase()) {
                        datum.count++;
                    }
                }
            }
            for (let datum of data) {
                datum.countColor = Math.round(datum.percent / 100 * datum.count);
            }
            for (let item of hexUnitArray) {
                let state = item.state.toLowerCase();
                for (let datum of data) {
                    if (datum.state.toLowerCase() == state) {
                        if (datum.countColor > 0) {
                            item.color = 'pink';
                            item.disabilityStatus = 'WithDisability';
                            datum.countColor--;
                        } else {
                            item.color = 'white';
                            item.disabilityStatus = 'NoDisability';

                        }
                    }
                }
            }

            var hexPolyline = g.selectAll('polyline')
                .data(hexUnitArray)
                .enter()
                .append('polyline')
                .attr('fill', d => d.color)
                .attr('stroke', d => {
                    if (d.color == "pink") {
                        return "white";
                    } else {
                        return "pink"
                    }
                })
                .attr('stroke-width', 2)
                .attr('data-state', d => {
                    return d.state;
                })
                .attr('data-disabilityStatus', d => {
                    return d.disabilityStatus;
                })
                .attr('points', d => {
                    return d.points;
                });

            // Build merged geometry for each state
            var stateCodes = []
            tilegram.objects.tiles.geometries.forEach(function (geometry) {
                if (stateCodes.indexOf(geometry.properties.name) === -1) {
                    stateCodes.push(geometry.properties.name)
                }
            })
            var stateBorders = stateCodes.map(function (code) {
                return topojson.merge(
                    tilegram,
                    tilegram.objects.tiles.geometries.filter(function (geometry) {
                        return geometry.properties.name === code
                    })
                )
            })

            // Draw path
            var stateBoundaries = g.selectAll('path.border')
                .data(stateBorders)
                .enter()
                .append('path')
                .attr('d', Dpath)
                .attr('data-state', (d, i) => {
                    return stateCodes[i];
                })
                .attr('class', 'border')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5);


            //select on click
            hexPolyline.on('click', d => {

                if (selectedStates.includes(d.state)) {
                    selectedStates.splice(selectedStates.indexOf(d.state), 1);
                    highlightStateBoundaries(false, d);
                    highlightState(false, d, hexPolyline);
                    changeView(selectedStates);
                } else {
                    selectedStates.push(d.state);
                    highlightStateBoundaries(true, d);
                    highlightState(true, d, hexPolyline);
                    changeView(selectedStates);
                }

            })

        });

        // // on hover code combining hexes with boundaries
        // hexPolyline.on('mouseover', function (d) {
        //         $(this).attr('fill', getColorByState(d.state));
        //         $('#stateName').text("STATE: " + d.state);
        //         highlightStateBoundaries(true, d);
        //     })
        //     .on('mouseout', function (d) {
        //         $(this).attr('fill', '#fff');
        //         $('#stateName').text("STATE");
        //         highlightStateBoundaries(false, d);
        //     })


    });

});

function highlightStateBoundaries(toBeHighlighted, d) {
    var selectorString = '"path.border[data-state=\'' + d.state + '\']"';

    if (toBeHighlighted) {
        $(selectorString).attr('stroke', 'rgba(0,134,173, 1)');
        $(selectorString).attr('stroke-width', 2.5);
    } else {
        $(selectorString).attr('stroke', 'black');
        $(selectorString).attr('stroke-width', 1);
    }
}

function highlightState(toBeHighlighted, d, hexPolyline) {
    var selectorString = '"polyline[data-state=\'' + d.state + '\']"';
    if (toBeHighlighted) {
        var withDisString = '"polyline[data-state=\'' + d.state + '\'][fill=pink]"';
        var noDisString = '"polyline[data-state=\'' + d.state + '\'][fill=white]"';

        $(withDisString).attr('fill', 'rgba(0,134,173, 0.4)');
        $(withDisString).attr('stroke', 'none');

        $(noDisString).attr('fill', 'white');
        $(noDisString).attr('stroke', 'rgba(0,134,173, 0.4)');

        //color disabled hexes

    } else {
        var withDisString = '"polyline[data-state=\'' + d.state + '\'][fill=\'rgba(0,134,173, 0.4)\']"';
        var noDisString = '"polyline[data-state=\'' + d.state + '\'][fill=white]"';

        $(withDisString).attr('fill', 'pink');
        $(withDisString).attr('stroke', 'none');

        $(noDisString).attr('fill', 'white');
        $(noDisString).attr('stroke', 'pink');
    }
}