var WIDTH = 1200
var HEIGHT = 1000

$('#stateName').css('left', WIDTH / 2);

selectedStates = [];

$(function () {

    let xScale = d3.scaleLinear()
        .domain([0, 2516.813057841345])
        .range([200, 610 + 800]);
    let yScale = d3.scaleLinear()
        .domain([-1330.1851549543212, 0])
        .range([-1300, -600]);

    d3.json("data/topo2018.json").then(tilegram => {
        // old code 
        tiles = topojson.feature(tilegram, tilegram.objects.tiles)
        transform = d3.geoTransform({
            point: function (x, y) {
                this.stream.point(xScale(x), yScale(-y))
            }
        });

        Dpath = d3.geoPath().projection(transform);

        //draw svg area
        const svg = d3.select('#viz1').append("svg")
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

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
                    point += xScale(hexCoordinate[0][i][0]) + ',' + yScale((hexCoordinate[0][i][1] * (-1))) + ','
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
                            item.color = '#FFAC1D';
                            item.disabilityStatus = 'WithDisability';
                            datum.countColor--;
                        } else {
                            item.color = '#FEF1D4';
                            item.disabilityStatus = 'NoDisability';
                        }
                    }
                }
            }

            var hexPolyline = g.selectAll('.hexUnitMap')
                .data(hexUnitArray)
                .enter()
                .append('polyline')
                .attr('class', 'hexUnitMap')
                .attr('data-disStat', d => d.disabilityStatus)
                .attr('fill', d => d.color)
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .attr('data-state', d => {
                    return d.state;
                })
                .attr('data-disabilityStatus', d => {
                    return d.disabilityStatus;
                })
                .attr('points', d => {
                    return d.points;
                });

            half1 = hexUnitArray.splice(0, hexUnitArray.length / 5);
            half2 = hexUnitArray.splice(0, hexUnitArray.length / 5);
            half3 = hexUnitArray.splice(0, hexUnitArray.length / 5);
            half4 = hexUnitArray.splice(0, hexUnitArray.length / 5);

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
                .attr('stroke', '#BBC5C4')
                .attr('stroke-width', 1);


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
        $(selectorString).attr('stroke-width', 1.5);
    } else {
        $(selectorString).attr('stroke', '#BBC5C4');
        $(selectorString).attr('stroke-width', 1);
    }
}

function highlightState(toBeHighlighted, d, hexPolyline) {
    var selectorString = '".hexUnitMap[data-state=\'' + d.state + '\']"';
    if (toBeHighlighted) {
        var withDisString = '".hexUnitMap[data-state=\'' + d.state + '\'][fill=#FFAC1D]"';
        var noDisString = '".hexUnitMap[data-state=\'' + d.state + '\'][fill=#FEF1D4]"';

        $(withDisString).attr('fill', '#49929F');
        $(withDisString).attr('stroke', 'white');

        $(noDisString).attr('fill', '#D5F0F1');
        $(noDisString).attr('stroke', 'white');

        //color disabled hexes

    } else {
        var withDisString = '".hexUnitMap[data-state=\'' + d.state + '\'][fill=\'#49929F\']"';
        var noDisString = '".hexUnitMap[data-state=\'' + d.state + '\'][fill=#D5F0F1]"';

        $(withDisString).attr('fill', '#FFAC1D');
        $(withDisString).attr('stroke', 'white');

        $(noDisString).attr('fill', '#FEF1D4');
        $(noDisString).attr('stroke', 'white');
    }
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