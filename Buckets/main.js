
//project work
let nestedData;
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

const colorMapping = {
    "$1 to $4,999 or loss": "red",
    "$5000 to $14999": "orange",
    "$15000 to $24999": "yellow",
    "$25000 to $34999": "green",
    "$35000 to $49999": "blue",
    "$50000 to $74999": "purple",
    "$75000 or more": "black",
}

d3.csv('../earnings.csv').then(data => {
    nestedData = d3.nest()
        .key(d => d.dis_stat)
        .key(d => d.income_bracket)
        .object(data);

    var dataForBuckets = dataForVisualMapping(nestedData);
    console.log(dataForBuckets);

    svg = d3.select('#main').select('svg');

    //choose data for bucket size

    //withDisability
    var lineCoordinates = getLineCoordinates(dataForBuckets['WithDisability']);
    console.log(lineCoordinates);

    buckets = svg.selectAll('line')
        .data(dataForBuckets['WithDisability'])
        .enter()
        .append('line')
        .attr('x1', function (d) { var coordinates = lineCoordinates[d['income_bracket']]; return coordinates.x1})
        .attr('y1', function (d) { var coordinates = lineCoordinates[d['income_bracket']]; return coordinates.y1})
        .attr('x2', function (d) { var coordinates = lineCoordinates[d['income_bracket']]; return coordinates.x2})
        .attr('y2', function (d) { var coordinates = lineCoordinates[d['income_bracket']]; return coordinates.y2})
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .exit();


});

function getLineCoordinates(dataBucket) {
    coordinates = {};
    var totalVal = d3.sum(dataBucket, function (d) { return +d['value'] });

    //computing x

    prevX = 0;

    for (var i in incomeBrackets) {
        var s = incomeBrackets[i];
        coordinates[s] = {};
        coordinates[s]['x1'] = prevX + 20;
        coordinates[s]['x2'] = prevX + 20 + (dataBucket.find(d => d['income_bracket'] == s)['value'] / totalVal) * chartWidth;
        coordinates[s]['y1'] = 100;
        coordinates[s]['y2'] = 100;

        prevX = coordinates[s]['x2']
    }

    //todo: computing y

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

            })
        }
    }

    WithDisabilityBracketData = [];
    incomeBrackets.forEach(i => {
        WithDisabilityBracketData.push({ 'income_bracket': i, 'value': BracketData.find(d => d['status'] == 'With a Disability' && d['income_bracket'] == i)['value'] })
    })

    NoDisabilityBracketData = [];
    incomeBrackets.forEach(i => {
        NoDisabilityBracketData.push({ 'income_bracket': i, 'value': BracketData.find(d => d['status'] == 'No Disability' && d['income_bracket'] == i)['value'] })
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