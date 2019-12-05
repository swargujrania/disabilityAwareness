
var WIDTH = 2500;
var HEIGHT = 2000;

margin = ({ top: 0, right: 0, bottom: 10, left: 50 });
height = 600;
width = 960;


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

    var stackData = getEducationStackData(eduDataWithoutTotal);
    showEducationStackedChart(stackData);

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

function getEducationStackData(eduDataWithoutTotal) {

    var withDisData = eduDataWithoutTotal.filter(e => e.disabilityType == 'With a Disability');
    var noDisData = eduDataWithoutTotal.filter(e => e.disabilityType == 'No Disability');

    var stackData = [];

    nestedData = d3.nest()
        .key(d => d.educationLevel)
        .rollup(d => {
            return { 'numbers': d3.sum(d, v => { return v.numbers; }), 'percentage': d3.mean(d, v => { return v.percentage; }) };
        })
        .entries(withDisData);
    var obj = { 'category': 'USA_With' };
    nestedData.forEach(n => { obj[n.key] = n.value.numbers });
    stackData.push(obj);


    nestedData = d3.nest()
        .key(d => d.educationLevel)
        .rollup(d => {
            return { 'numbers': d3.sum(d, v => { return v.numbers; }), 'percentage': d3.mean(d, v => { return v.percentage; }) };
        })
        .entries(noDisData);
    obj = { 'category': 'USA_No' };
    nestedData.forEach(n => { obj[n.key] = n.value.numbers });
    stackData.push(obj);

    return { 'data': stackData, 'keys': nestedData.map(n => n.key) };
}

function showEducationStackedChart(stackData) {

    var sData = d3.stack().keys(stackData.keys)(stackData.data);

    var scales = setScales(sData, stackData)

    svg = d3.select('#vis1').append('svg')
        .attr("viewBox", [0, 0, width, height]);

    yAxis = d3.axisLeft(scales.y).ticks(null, 's');
    xAxis = d3.axisBottom(scales.x).tickSizeOuter([10]);

    svg.append("g")
        .selectAll("g")
        .data(sData)
        .join("g")
        .attr("fill", d => scales.color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => scales.x(d.data.category))
        .attr("y", d => scales.y(d[1]))
        .attr("height", d => scales.y(d[0]) - scales.y(d[1]))
        // .attr("width", 100);
        .attr("width", scales.x.bandwidth());

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(yAxis);

    svg.append("g")
        .attr("transform", `translate(0,${ height - 100 })`)
        .call(xAxis);

}

function setScales(sData, stackData) {
    color = d3.scaleOrdinal()
        .domain(sData.map(d => d.key))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), sData.length).reverse())
        .unknown("#ccc");

    y = d3.scaleLinear()
        .domain([0, d3.max(sData, d => d3.max(d, d => d[1]))])
        .rangeRound([height - 100 - margin.bottom, margin.top]);

    x = d3.scaleBand()
        .domain(stackData.data.map(d => d.category))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    return { 'color': color, 'y': y, 'x': x };

}