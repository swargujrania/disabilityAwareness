
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

    var svg = d3.select('#main').select('svg');

});


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

    WithDisabilityBracketData = BracketData.filter(e => e['status'] == 'With a Disability');
    NoDisabilityBracketData = BracketData.filter(e => e['status'] == 'No Disability');

    AllDisabilityBracketData = []

    incomeBrackets.forEach(i => AllDisabilityBracketData.push({
        'income_bracket': i,
        'value': WithDisabilityBracketData.find(w => w['income_bracket'] == i)['value'] + NoDisabilityBracketData.find(w => w['income_bracket'] == i)['value']
    }))

    return {
        'WithDisability': WithDisabilityBracketData,
        'NoDisability': NoDisabilityBracketData,
        'All': AllDisabilityBracketData,
    }

}

function computeSumForIncomeBracket(incomeBracketData) {
    return d3.sum(incomeBracketData, function (d) {
        return +d['value']
    });
}