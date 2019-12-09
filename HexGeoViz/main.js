
var WIDTH = 2500
var HEIGHT = 2000

colorPalette = ['#ffd600', '#c9e402', '#b6ff64', '#63c964', '#6fffbf', '#67b1a0', '#00caba', '#06efff', '#008eaa', '#2284dd'];
$('#stateName').css('left', WIDTH / 2);

selectedStates = [];


$(function () {

    d3.json("data/topo2018.json").then(tilegram => {
        console.log(tilegram);

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
            .attr('transform', 'translate(-400,' + 1300 + ')')


        //draw hex-grid
        Coordinates = tiles.features.map(t => t.geometry).map(u => u.coordinates).flat();
        hexUnitArray = [];
        tiles.features.forEach(element => {
            var hexCoordinateArray = element.geometry.coordinates;

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
        var hexPolyline = g.selectAll('polyline')
            .data(hexUnitArray)
            .enter()
            .append('polyline')
            .attr('fill', '#fff')
            .attr('stroke', d => { return getColorByState(d.state) })
            .attr('data-state', d => { return d.state; })
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
            .attr('data-state', (d, i) => { return stateCodes[i]; })
            .attr('class', 'border')
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 1);


        // on hover code combining hexes with boundaries
        hexPolyline.on('mouseover', function (d) {
            $(this).attr('fill', getColorByState(d.state));
            $('#stateName').text("STATE: " + d.state);
            //highlightStateBoundaries(true, d);
        })
            .on('mouseout', function (d) {
                $(this).attr('fill', '#fff');
                $('#stateName').text("STATE");
                //highlightStateBoundaries(false, d);
            })

        //select on click
        hexPolyline.on('click', d => {

            if (selectedStates.includes(d.state)) {
                selectedStates.splice(selectedStates.indexOf(d.state), 1);
                highlightStateBoundaries(false, d);
            }
            else {
                selectedStates.push(d.state);
                highlightStateBoundaries(true, d);
            }

            console.log(selectedStates);

        })

    })

})

function getColorByState(stateName) {

    var stt = stateName[0] + stateName.substr(1).toLowerCase();

    switch (stt) {
        case 'Wyoming':
            return colorPalette[1]
            break;
        case 'Wisconsin':
            return colorPalette[1]
            break;
        case 'West Virginia':
            return colorPalette[1]
            break;
        case 'Washington':
            return colorPalette[1]
            break;
        case 'Virginia':
            return colorPalette[1]
            break;
        case 'Virgin Islands':
            return colorPalette[2]
            break;
        case 'Vermont':
            return colorPalette[2]
            break;
        case 'Utah':
            return colorPalette[2]
            break;
        case 'Texas':
            return colorPalette[2]
            break;
        case 'South Dakota':
            return colorPalette[2]
            break;
        case 'Tennessee':
            return colorPalette[9]
            break;
        case 'South Carolina':
            return colorPalette[3]
            break;
        case 'Rhode Island':
            return colorPalette[3]
            break;
        case 'Pennsylvania':
            return colorPalette[3]
            break;
        case 'Oregon':
            return colorPalette[3]
            break;
        case 'Oklahoma':
            return colorPalette[4]
            break;
        case 'Ohio':
            return colorPalette[4]
            break;
        case 'North Dakota':
            return colorPalette[4]
            break;
        case 'North Carolina':
            return colorPalette[4]
            break;
        case "New York":
            return colorPalette[4]
            break;
        case 'New Mexico':
            return colorPalette[5]
            break;
        case 'New Jersey':
            return colorPalette[5]
            break;
        case 'New Hampshire':
            return colorPalette[5]
            break;
        case 'Nevada':
            return colorPalette[5]
            break;
        case 'Nebraska':
            return colorPalette[5]
            break;
        case 'Montana':
            return colorPalette[6]
            break;
        case 'Missouri':
            return colorPalette[6]
            break;
        case 'Mississippi':
            return colorPalette[6]
            break;
        case 'Minnesota':
            return colorPalette[6]
            break;
        case 'Michigan':
            return colorPalette[6]
            break;
        case 'Massachusetts':
            return colorPalette[7]
            break;
        case 'Maryland':
            return colorPalette[7]
            break;
        case 'Maine':
            return colorPalette[7]
            break;
        case 'Louisiana':
            return colorPalette[7]
            break;
        case 'Kentucky':
            return colorPalette[7]
            break;
        case 'Kansas':
            return colorPalette[8]
            break;
        case 'Iowa':
            return colorPalette[8]
            break;
        case 'Indiana':
            return colorPalette[8]
            break;
        case 'Illinois':
            return colorPalette[8]
            break;
        case 'Idaho':
            return colorPalette[8]
            break;
        case 'Hawaii':
            return colorPalette[9]
            break;
        case 'Guam':
            return colorPalette[9]
            break;
        case 'Georgia':
            return colorPalette[3]
            break;
        case 'Florida':
            return colorPalette[9]
            break;
        case 'District Of Columbia':
            return colorPalette[9]
            break;
        case 'Delaware':
            return colorPalette[0]
            break;
        case 'Connecticut':
            return colorPalette[0]
            break;
        case 'Colorado':
            return colorPalette[0]
            break;
        case 'California':
            return colorPalette[0]
            break;
        case 'Arkansas':
            return colorPalette[0]
            break;
        case 'Arizona':
            return colorPalette[0]
            break;
        case 'Alaska':
            return colorPalette[0]
            break;
        case 'Alabama':
            return colorPalette[0]
            break;
        default:
            return colorPalette[0]
            break;

    }

}

function highlightStateBoundaries(toBeHighlighted, d) {
    var selectorString = 'path[data-state=' + d.state + ']';

    if (toBeHighlighted) {
        $(selectorString).attr('stroke', 'black');
        $(selectorString).attr('stroke-width', 2);
    }
    else {
        $(selectorString).attr('stroke', 'grey');
        $(selectorString).attr('stroke-width', 1);
    }
}