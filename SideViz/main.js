
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

    var stackData = getTotalStackData(eduDataWithoutTotal, 'educationLevel');
    showTotalStackedChart(stackData, 10, 0, '#vis1', 'Education Levels in US', false);

    //state wise data
    var stateWiseStackData = getStateWiseStackData(eduDataWithoutTotal, [], 'educationLevel', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis1', 'By states');



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

    var stackData = getTotalStackData(earningDataWithoutTotal, 'earningLevel');
    showTotalStackedChart(stackData, 10, 0, '#vis2', 'Earning (past 12 months)');

    //state wise data
    var stateWiseStackData = getStateWiseStackData(earningDataWithoutTotal, [], 'earningLevel', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis2', 'By states');

});

//poverty status bar chart
d3.csv('data/poverty2018.csv').then(data => {

    //clean data
    povertyData = data;

    var povertyDataWithoutTotal = povertyData.filter(e => e.povertyStatus != "");
    povertyDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getTotalStackData(povertyDataWithoutTotal, 'povertyStatus');
    showTotalStackedChart(stackData, 10, 0, '#vis3', 'Poverty Status (past 12 months)');

    //state wise data
    var stateWiseStackData = getStateWiseStackData(povertyDataWithoutTotal, [], 'povertyStatus', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis3', 'By states');


});


//employment status bar chart
d3.csv('data/employmentStatus2018.csv').then(data => {

    //clean data
    empData = data;

    var empDataWithoutTotal = empData.filter(e => e.employmentStatus != "");
    empDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getTotalStackData(empDataWithoutTotal, 'employmentStatus');
    showTotalStackedChart(stackData, 10, 0, '#vis4', 'Employment Status');

    //state wise data
    var stateWiseStackData = getStateWiseStackData(empDataWithoutTotal, [], 'employmentStatus', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis4', 'By states');

});

//class of worker bar chart
d3.csv('data/classOfWorker2018.csv').then(data => {

    //clean data
    cowData = data;

    var cowDataWithoutTotal = cowData.filter(e => e.classOfWorker != "");
    cowDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getTotalStackData(cowDataWithoutTotal, 'classOfWorker');
    showTotalStackedChart(stackData, 10, 0, '#vis5', 'Class of Workers');

    //state wise data
    var stateWiseStackData = getStateWiseStackData(cowDataWithoutTotal, [], 'classOfWorker', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis5', 'By states');

});

//industry bar chart
d3.csv('data/industry2018.csv').then(data => {

    //clean data
    industryData = data;

    var industryDataWithoutTotal = industryData.filter(e => e.industry != "");
    industryDataWithoutTotal.forEach(e => {
        e.numbers = +e.numbers;
        e.percentage = +e.percentage;
    });

    var stackData = getTotalStackData(industryDataWithoutTotal, 'industry');
    showTotalStackedChart(stackData, 10, 0, '#vis6', 'Industry');

    //state wise data
    var stateWiseStackData = getStateWiseStackData(industryDataWithoutTotal, [], 'industry', stackData.keys)
    console.log(stateWiseStackData);
    showStateWiseStackedChart(stateWiseStackData, 50, 0, '#vis6', 'By states');

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

function setScales(sData, stackData, isStateWise) {

    var w = isStateWise ? width + 700 : width;
    var l = isStateWise ? margin.left + 20 : margin.left;
    color = d3.scaleOrdinal()
        .domain(sData.map(d => d.key))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), sData.length).reverse())
        .unknown("#ccc");

    y = d3.scaleLinear()
        .domain([0, d3.max(sData, d => d3.max(d, d => d[1]))])
        .rangeRound([height - 100, margin.top]);

    x = d3.scaleBand()
        .domain(stackData.data.map(d => d.category))
        .range([l + 50, w - margin.right - 50])
        .padding(0.3)

    return { 'color': color, 'y': y, 'x': x };

}

function showTotalStackedChart(stackData, locX, locY, svgSection, title) {

    var sData = d3.stack().keys(stackData.keys)(stackData.data);
    var scales = setScales(sData, stackData, false)

    var svg = d3.select(svgSection).append('svg')
        .attr("width", width + 300)
        .attr("transform", `translate(${ locX }, ${ locY })`)
        .attr("height", height);

    yAxis = d3.axisLeft(scales.y).ticks(20);
    xAxis = d3.axisBottom(scales.x);
    legend = l => {
        const m = l
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(stackData.keys.reverse())
            .enter().append("g")
            .attr("transform", (d, i) => `translate(${ width + 50},${ i * 20 })`);

        m.append("text")
            .attr("x", 10)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => d);

        m.append("rect")
            .attr("x", -19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", scales.color);
    }

    svg.append('text')
        .text(title)
        .attr("transform", `translate(0,${ height / 2 })`)

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

    svg.append('g')
        .call(legend);

}

function showStateWiseStackedChart(stackData, locX, locY, svgSection, title) {

    var sData = d3.stack().keys(stackData.keys)(stackData.data);
    var scales = setScales(sData, stackData, true)
    var w = width + 700;
    var svg = d3.select(svgSection).append('svg')
        .attr("width", w)
        .attr("transform", `translate(${ locX }, ${ locY })`)
        .attr("height", height);

    yAxis = d3.axisLeft(scales.y).ticks(20);
    xAxis = d3.axisBottom(scales.x);
    legend = l => {
        const m = l
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(stackData.keys.reverse())
            .enter().append("g")
            .attr("transform", (d, i) => `translate(${ w },${ i * 20 })`);

        m.append("text")
            .attr("x", -24)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => d);

        m.append("rect")
            .attr("x", -19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", scales.color);

    }

    svg.append('text')
        .text(title)
        .attr("transform", `translate(0,${ height / 2 })`)

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
        .attr("transform", `translate(10,50)`);

    svg.append("g")
        .attr("transform", `translate(130,50)`)
        .call(yAxis);

    svg.append("g")
        .attr("transform", `translate(10,${ height - 40 })`)
        .call(xAxis);

    svg.append('g')
        .call(legend);

}

function getTotalStackData(data, keyForNesting) {
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


    // nestedData = d3.nest()
    //     .key(d => d[keyForNesting])
    //     .rollup(d => {
    //         return { 'numbers': d3.sum(d, v => { return v.numbers; }), 'percentage': d3.mean(d, v => { return v.percentage; }) };
    //     })
    //     .entries(noDisData);
    // obj = { 'category': 'USA_No' };
    // nestedData.forEach(n => { obj[n.key] = n.value.numbers });
    // stackData.push(obj);

    return { 'data': stackData, 'keys': nestedData.map(n => n.key) }

}

function getStateWiseStackData(data, stateList, keyForNesting, keys) {
    var withDisData = []

    if (stateList == null || stateList == undefined || stateList.length == 0) {
        withDisData = data.filter(e => e.disabilityType == 'With a Disability');
    }
    else {
        withDisData = data.filter(e => e.disabilityType == 'With a Disability' && stateList.includes(e.state));
    }

    var nestedData = d3.nest()
        .key(d => d.state)
        .entries(withDisData);

    var stackData = [];
    nestedData.forEach(n => {
        var obj = { 'category': n.key };
        n.values.forEach(v => {
            obj[v[keyForNesting]] = v.numbers
        })

        stackData.push(obj);
    })

    return { 'data': stackData, 'keys': keys };

}