//project work
let nestedData;
let circles = [];
const peopleUnit = 100000;
const incomeBrackets = [
    "$1 to $4,999 or loss",
    "$5000 to $14999",
    "$15000 to $24999",
    "$25000 to $34999",
    "$35000 to $49999",
    "$50000 to $74999",
    "$75000 or more"
];

const chartWidth = 1000;
const chartHeight = 1000;

d3.csv('../earnings.csv').then(data => {
    nestedData = d3.nest()
        .key(d => d.dis_stat)
        .key(d => d.income_bracket)
        .object(data);

    var dataForBuckets = dataForVisualMapping(nestedData);

    svg = d3.select('#main').select('svg').style('margin', 'auto');

    var lineCoordinates = getLineCoordinates(dataForBuckets['WithDisability']);

    buckets = svg.selectAll('line')
        .data(dataForBuckets['WithDisability'])
        .enter()
        .append('line')
        .attr('x1', function (d) {
            var coordinates = lineCoordinates[d['income_bracket']];
            return coordinates.x1
        })
        .attr('y1', function (d) {
            var coordinates = lineCoordinates[d['income_bracket']];
            return coordinates.y1
        })
        .attr('x2', function (d) {
            var coordinates = lineCoordinates[d['income_bracket']];
            return coordinates.x2
        })
        .attr('y2', function (d) {
            var coordinates = lineCoordinates[d['income_bracket']];
            return coordinates.y2
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    for (let bracket of dataForBuckets.WithDisability) {
        bracket.currentPos = {
            x: 2,
            y: -5
        }
    }

    for (let type in nestedData) {
        for (let bracket in nestedData[type]) {
            for (let state in nestedData[type][bracket]) {
                let num = nestedData[type][bracket][state].value;
                for (let i = 0; i < num / peopleUnit; i++) {
                    let dotChar = {
                        state: nestedData[type][bracket][state]["state"],
                        bracket: bracket,
                        type: type
                    }
                    circles.push(dotChar);
                }
            }
        }
    }

    // circles = shuffle(circles);

    let dots = svg.selectAll('circle')
        .data(circles)
        .enter()
        .append('circle')
        .attr('cx', 500)
        .attr('cy', -100)
        .attr('r', 5)
        .style('fill', d => {
            if (d.type == "With a Disability") {
                return 'red';
            } else {
                return 'white';
            }
        })
        .style('stroke', 'red');

    window.setTimeout(() => {
        dots.transition()
            .duration(3000)
            .attr('cx', (d, i) => {
                let bucket = (dataForBuckets.WithDisability.find(item => item.income_bracket == d.bracket));
                let xPos = lineCoordinates[d.bracket].x1 + bucket.currentPos.x;
                if (xPos < lineCoordinates[d.bracket].x2 - 10) {
                    bucket.currentPos.x += 10;
                    d.change = false;
                } else {
                    bucket.currentPos.x = 2;
                    d.change = true;
                }
                return xPos;
            })
            .attr('cy', (d, i) => {
                let bucket = (dataForBuckets.WithDisability.find(item => item.income_bracket == d.bracket));
                if (d.change) {
                    bucket.currentPos.y -= 10;
                }
                let yPos = lineCoordinates[d.bracket].y1 + bucket.currentPos.y;
                return yPos;
            });
    }, 100);
});

function getLineCoordinates(dataBucket) {
    coordinates = {};
    var totalVal = d3.sum(dataBucket, function (d) {
        return +d['value']
    });

    //computing x
    //computing y

    prevX = 0;

    let prevY = 700;

    for (var i in incomeBrackets) {
        var s = incomeBrackets[i];
        coordinates[s] = {};
        coordinates[s]['x1'] = prevX + 20;
        coordinates[s]['x2'] = prevX + 20 + (dataBucket.find(d => d['income_bracket'] == s)['value'] / totalVal) * chartWidth;
        coordinates[s]['y1'] = prevY;
        coordinates[s]['y2'] = prevY;

        prevX = coordinates[s]['x2'];
        prevY = coordinates[s]['y2'];
    }

    return coordinates
}

function dataForVisualMapping(nestedData) {

    delete nestedData['Total Civilian Noninstitutionalized Population'];

    var BracketData = [];

    for (let status in nestedData) {
        delete nestedData[status][''];
        delete nestedData[status]['Median Earnings'];

        for (let bracket in nestedData[status]) {
            var incomeBracketSum = computeSumForIncomeBracket(nestedData[status][bracket]);
            BracketData.push({
                'status': status,
                'income_bracket': bracket,
                'value': incomeBracketSum
            });
        }
    }

    WithDisabilityBracketData = [];
    incomeBrackets.forEach(i => {
        WithDisabilityBracketData.push({
            'income_bracket': i,
            'value': BracketData.find(d => d['status'] == 'With a Disability' && d['income_bracket'] == i)['value']
        })
    })

    NoDisabilityBracketData = [];
    incomeBrackets.forEach(i => {
        NoDisabilityBracketData.push({
            'income_bracket': i,
            'value': BracketData.find(d => d['status'] == 'No Disability' && d['income_bracket'] == i)['value']
        })
    })

    AllDisabilityBracketData = {}
    incomeBrackets.forEach(i => {
        AllDisabilityBracketData[i.toString()] = WithDisabilityBracketData.find(d => d['income_bracket'] == i)['value'] + NoDisabilityBracketData.find(d => d['income_bracket'] == i)['value'];
    })

    return {
        'WithDisability': WithDisabilityBracketData,
        'NoDisability': NoDisabilityBracketData,
        'AllDisability': AllDisabilityBracketData,
    }

}

function computeSumForIncomeBracket(incomeBracketData) {
    return d3.sum(incomeBracketData, function (d) {
        return +d['value']
    });
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}