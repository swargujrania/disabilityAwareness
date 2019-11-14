
//project work
let nestedData;
const peopleUnit = 100000;
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

    var dataForCircles = dataForVisualMapping(nestedData);

    console.log(dataForCircles);

    var svg = d3.select('#main').select('svg');

});


function dataForVisualMapping(nestedData) {

    BracketData = [];

    for (let status in nestedData) {
        if (status == "Total Civilian Noninstitutionalized Population") {
            continue;
        }

        for (let bracket in nestedData[status]) {
            var incomeBracketSum = computeSumForIncomeBracket(nestedData[status][bracket]);
            BracketData.push({
                'status': status,
                'income_bracket': bracket,
                'cumulative_number': incomeBracketSum

            })
        }
    }

    var BracketData = BracketData.filter(e => e['income_bracket'] != '' && e['income_bracket'] != 'Median Earnings');

    var BracketData_2 = [];

    BracketData.forEach(e =>{

    });
    
    console.log(BracketData);
    console.log(nestedData);

}

function computeSumForIncomeBracket(incomeBracketData) {
    return d3.sum(incomeBracketData, function (d) {
        return +d['value']
    });
}




// data cleaning
// d3.json('csvjson.json').then(function (dataset) {
//     //console.log(dataset);
//     labels = dataset[0];
//     //console.log(labels);

//     delete labels.GEO_ID;
//     delete labels.NAME;

//     colNameList = [];

//     for (var item in labels) {
//         if (!labels[item].includes("Margin of Error")) {
//             colNameList.push(labels[item]);
//         }
//     }

//     //console.log(colNameList);

//     resultString = "";

//     for (var i = 0; i < colNameList.length; i++) {
//         var x = colNameList[i].split('__');
//         resultString += x.join(',');
//         resultString += '\n'
//     }
//     console.log(resultString);


//     let csvContent = "data:text/csv;charset=utf-8," + resultString;
//     var encodedUri = encodeURI(csvContent);
//     window.open(encodedUri);

//     var encodedUri = encodeURI(csvContent);
//     var link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "my_data.csv");
//     document.body.appendChild(link); // Required for FF

//     link.click();









//     //console.log(resultString);

//     // linkScale.domain(d3.extent(network.links, function (d) { return d.value; }));

//     // var linkG = svg.append('g')
//     //     .attr('class', 'links-group');

//     // //add links
//     // var linkEnter = linkG.selectAll('.link')
//     //     .data(network.links)
//     //     .enter()
//     //     .append('line')
//     //     .attr('class', 'link')
//     //     .attr('stroke-width', function (d) {
//     //         return linkScale(d.value);
//     //     });

//     // var nodeG = svg.append('g')
//     //     .attr('class', 'nodes-group');

//     // var tip = d3.tip()
//     //     .html(function (d) {
//     //         return "<strong>" + d.id + "</strong>";
//     //     });

//     // //add nodes
//     // var nodeEnter = nodeG.selectAll('.node')
//     //     .data(network.nodes)
//     //     .enter()
//     //     .append('circle')
//     //     .attr('class', 'node')
//     //     .attr('r', 6)
//     //     .style('fill', function (d) {
//     //         return colorScale(d.group);
//     //     })
//     //     .on('mouseover', tip.show)
//     //     .on('mouseout', tip.hide);



//     // simulation
//     //     .nodes(dataset.nodes)
//     //     .on('tick', tickSimulation);

//     // simulation.force('link')
//     //     .links(dataset.links);


//     // function tickSimulation() {
//     //     linkEnter
//     //         .attr('x1', function (d) { return d.source.x; })
//     //         .attr('y1', function (d) { return d.source.y; })
//     //         .attr('x2', function (d) { return d.target.x; })
//     //         .attr('y2', function (d) { return d.target.y; });

//     //     nodeEnter
//     //         .attr('cx', function (d) { return d.x; })
//     //         .attr('cy', function (d) { return d.y; });
//     // }

//     // nodeEnter.call(drag);
//     // nodeEnter.call(tip);
// });

// earnings


/////// lab
// var svg = d3.select('svg');
// var width = +svg.attr('width');
// var height = +svg.attr('height');

// var colorScale = d3.scaleOrdinal(d3.schemeTableau10);
// var linkScale = d3.scaleSqrt().range([1, 5]);

// var drag = d3.drag()
//     .on('start', dragstarted)
//     .on('drag', dragged)
//     .on('end', dragended);

// var simulation = d3.forceSimulation()
//     .force('link', d3.forceLink().id(function (d) { return d.id; }))
//     .force('charge', d3.forceManyBody())
//     .force('center', d3.forceCenter(width / 2, height / 2));

// function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;

// }

// function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
// }

// function dragended(d) {
//     if (!d3.event.active) simulation.alphaTarget(0);

//     //commenting the code below to allow pinning
//     // d.fx = null;
//     // d.fy = null;
// //}