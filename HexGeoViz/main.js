const WIDTH = 2500,
    HEIGHT = 2000;

d3.json("topo2018.json").then(tilegram => {

    tiles = topojson.feature(tilegram, tilegram.objects.tiles);

    transform = d3.geoTransform({
        point: function (x, y) {
            this.stream.point(x, -y)
        }
    });

    const svg = d3.select('#main')
        .append("svg")
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    var g = svg.append('g')
        .attr('transform', 'translate(-400,' + 1300 + ')');

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

    d3.csv('./data/2018.csv').then(data => {

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
                        item.color = 'red';
                        datum.countColor--;
                    } else {
                        item.color = 'pink';
                    }
                }
            }
        }

        g.selectAll('polyline')
            .data(hexUnitArray)
            .enter()
            .append('polyline')
            .attr('fill', d => {
                return d.color;
            })
            .attr('stroke', d => {
                return 'black';
            })
            .attr('data-state', d => {
                return d.state;
            })
            .attr('points', d => {
                return d.points;
            });
    });
});

// function getColorByState(stateName) {

//     var stt = stateName[0] + stateName.substr(1).toLowerCase();

//     switch (stt) {
//         case 'Wyoming':
//             return colorPalette[1]
//             break;
//         case 'Wisconsin':
//             return colorPalette[1]
//             break;
//         case 'West Virginia':
//             return colorPalette[1]
//             break;
//         case 'Washington':
//             return colorPalette[1]
//             break;
//         case 'Virginia':
//             return colorPalette[1]
//             break;
//         case 'Virgin Islands':
//             return colorPalette[2]
//             break;
//         case 'Vermont':
//             return colorPalette[2]
//             break;
//         case 'Utah':
//             return colorPalette[2]
//             break;
//         case 'Texas':
//             return colorPalette[2]
//             break;
//         case 'South Dakota':
//             return colorPalette[2]
//             break;
//         case 'Tennessee':
//             return colorPalette[3]
//             break;
//         case 'South Carolina':
//             return colorPalette[3]
//             break;
//         case 'Rhode Island':
//             return colorPalette[3]
//             break;
//         case 'Pennsylvania':
//             return colorPalette[3]
//             break;
//         case 'Oregon':
//             return colorPalette[3]
//             break;
//         case 'Oklahoma':
//             return colorPalette[4]
//             break;
//         case 'Ohio':
//             return colorPalette[4]
//             break;
//         case 'North Dakota':
//             return colorPalette[4]
//             break;
//         case 'North Carolina':
//             return colorPalette[4]
//             break;
//         case "New York":
//             return colorPalette[4]
//             break;
//         case 'New Mexico':
//             return colorPalette[5]
//             break;
//         case 'New Jersey':
//             return colorPalette[5]
//             break;
//         case 'New Hampshire':
//             return colorPalette[5]
//             break;
//         case 'Nevada':
//             return colorPalette[5]
//             break;
//         case 'Nebraska':
//             return colorPalette[5]
//             break;
//         case 'Montana':
//             return colorPalette[6]
//             break;
//         case 'Missouri':
//             return colorPalette[6]
//             break;
//         case 'Mississippi':
//             return colorPalette[6]
//             break;
//         case 'Minnesota':
//             return colorPalette[6]
//             break;
//         case 'Michigan':
//             return colorPalette[6]
//             break;
//         case 'Massachusetts':
//             return colorPalette[7]
//             break;
//         case 'Maryland':
//             return colorPalette[7]
//             break;
//         case 'Maine':
//             return colorPalette[7]
//             break;
//         case 'Louisiana':
//             return colorPalette[7]
//             break;
//         case 'Kentucky':
//             return colorPalette[7]
//             break;
//         case 'Kansas':
//             return colorPalette[8]
//             break;
//         case 'Iowa':
//             return colorPalette[8]
//             break;
//         case 'Indiana':
//             return colorPalette[8]
//             break;
//         case 'Illinois':
//             return colorPalette[8]
//             break;
//         case 'Idaho':
//             return colorPalette[8]
//             break;
//         case 'Hawaii':
//             return colorPalette[9]
//             break;
//         case 'Guam':
//             return colorPalette[9]
//             break;
//         case 'Georgia':
//             return colorPalette[9]
//             break;
//         case 'Florida':
//             return colorPalette[9]
//             break;
//         case 'District Of Columbia':
//             return colorPalette[9]
//             break;
//         case 'Delaware':
//             return colorPalette[0]
//             break;
//         case 'Connecticut':
//             return colorPalette[0]
//             break;
//         case 'Colorado':
//             return colorPalette[0]
//             break;
//         case 'California':
//             return colorPalette[0]
//             break;
//         case 'Arkansas':
//             return colorPalette[0]
//             break;
//         case 'Arizona':
//             return colorPalette[0]
//             break;
//         case 'Alaska':
//             return colorPalette[0]
//             break;
//         case 'Alabama':
//             return colorPalette[0]
//             break;
//         default:
//             return colorPalette[0]
//             break;

//     }

// }