
var WIDTH = 2500;
var HEIGHT = 2000;

margin = ({ top: 0, right: 0, bottom: 10, left: 50 });
height = 500;
width = 500;


//education stacked bar chart
d3.csv('data/education2018.csv').then(data => {

    //clean data
    educationData = data;
    educationData.forEach(e => { delete e.Section; delete e.age; })
    educationData.columns.splice(3, 2);

    var eduDataWithoutTotal = educationData.filter(e => e.educationLevel != "");
    eduDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getStackData(eduDataWithoutTotal, 'educationLevel');
    showStackedChart(stackData, 10, 0, '#vis1', 'Education Levels in US');

});

//earning stacked bar chart
d3.csv('data/earning2018.csv').then(data => {

    //clean data
    earningData = data;

    var earningDataWithoutTotal = earningData.filter(e => e.earningLevel != "");
    earningDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getStackData(earningDataWithoutTotal, 'earningLevel');
    showStackedChart(stackData, 10,0, '#vis2', 'Earning (past 12 months)');

});

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function setScales(sData, stackData) {
    color = d3.scaleOrdinal()
        .domain(sData.map(d => d.key))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), sData.length).reverse())
        .unknown("#ccc");

    y = d3.scaleLinear()
        .domain([0, d3.max(sData, d => d3.max(d, d => d[1]))])
        .rangeRound([height - 100, margin.top]);

    x = d3.scaleBand()
        .domain(stackData.data.map(d => d.category))
        .range([margin.left + 50, width - margin.right - 50])
        .padding(0.2)

    return { 'color': color, 'y': y, 'x': x };

}

function showStackedChart(stackData, locX, locY, svgSection, title) {

    var sData = d3.stack().keys(stackData.keys)(stackData.data);

    var scales = setScales(sData, stackData)

    var svg = d3.select(svgSection).append('svg')
        .attr("width", width)
        .attr("transform", `translate(${ locX }, ${ locY })`)
        .attr("height", height);

    yAxis = d3.axisLeft(scales.y).ticks(20, 's');
    xAxis = d3.axisBottom(scales.x).tickSizeOuter([10]);

    svg.append('text')
        .text(title)
        .attr("transform", `translate(0,${ height / 2 })`);

    svg.append("g")
        .selectAll("g")
        .data(sData)
        .join("g")
        .attr("fill", d => scales.color(d.key))
        .attr("stroke", 'white')
        .attr("stroke-width", '1')
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => scales.x(d.data.category))
        .attr("y", d => scales.y(d[1]))
        .attr("height", d => scales.y(d[0]) - scales.y(d[1]))
        .attr("width", scales.x.bandwidth())
        .attr("transform", `translate(80,50)`);

    svg.append("g")
        .attr("transform", `translate(200,50)`)
        .call(yAxis);

    svg.append("g")
        .attr("transform", `translate(80,${ height - 40 })`)
        .call(xAxis);

}

function getStackData(data, keyForNesting) {
    var withDisData = data.filter(e => e.disabilityType == 'With a Disability');
    var noDisData = data.filter(e => e.disabilityType == 'No Disability');

    var stackData = [];

    nestedData = d3.nest()
        .key(d => d[keyForNesting])
        .rollup(d => {
            return { 'numbers': d3.sum(d, v => { return v.numbers; }), 'percentage': d3.mean(d, v => { return v.percentage; }) };
        })
        .entries(withDisData);
    var obj = { 'category': 'USA_With' };
    nestedData.forEach(n => { obj[n.key] = n.value.numbers });
    stackData.push(obj);


    nestedData = d3.nest()
        .key(d => d[keyForNesting])
        .rollup(d => {
            return { 'numbers': d3.sum(d, v => { return v.numbers; }), 'percentage': d3.mean(d, v => { return v.percentage; }) };
        })
        .entries(noDisData);
    obj = { 'category': 'USA_No' };
    nestedData.forEach(n => { obj[n.key] = n.value.numbers });
    stackData.push(obj);

    return { 'data': stackData, 'keys': nestedData.map(n => n.key) }

}