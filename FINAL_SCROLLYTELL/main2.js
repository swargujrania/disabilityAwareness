//**********  Viz 2: Matrix of age group vs disability type  **************

var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-12, 0])
    .html(function (d) {
        return "<h5>" + d['dis'] + "</h5>";
    });

//Setting up chart layout
var svgWidth_2 = reSize(2100);
var svgHeight_2 = reSize(2000);

var margin_2 = {
    top: reSize(100),
    right: reSize(50),
    bottom: reSize(100),
    left: reSize(50)
}; // Define a padding object
var axis_2 = {
    l: reSize(125),
    t: reSize(50)
}; // Leaving space for drawing axes and their labels



// Compute the dimensions of the chart
chartWidth_2 = svgWidth_2 - margin_2.left - margin_2.right;
chartHeight_2 = svgHeight_2 - margin_2.top - margin_2.bottom;


//Actual chart for the circles (excluding the axes)
plotWidth_2 = chartWidth_2 - axis_2.l - reSize(25);
plotHeight_2 = reSize(200); // for each age group


//Global variables
var betweenDots_2 = reSize(2);
var betweenAge_2 = reSize(300);
var dotRadius_2 = reSize(5);


//center position for 1st circle
var y_2 = dotRadius_2 + margin_2.top + axis_2.t;
var x_2 = reSize(7) + dotRadius_2 + margin_2.left + axis_2.l;

const spacing_2 = {
    "Population under 18 years": reSize(5.3),
    "Population 18 to 34 years": reSize(6.66),
    "Population 35 to 64 years": reSize(1.9),
    "Population 65 to 74 years": reSize(18.6),
    "Population 75 years and over": reSize(30.5),
    "disability": reSize(2)
}

//Global variables

var colorMapping_2 = {
    "Hearing": "#75D2B4",
    "Vision": "#49929F",
    "Cognitive": "#C45165",
    "Ambulatory": "#C28CD4",
    "Self-care": "#F59723",
    "Independent Living": "#93CB57",
    "none": "#FFE6B5",
}

var noneOpacity_2 = 0;
var otherOpacity_2 = 1;

function convertToHex_Final(x, y) {
    return `
    ${x-reSize(5)},${y} 
    ${x-reSize(3)},${y-reSize(4.5)} 
    ${x+reSize(3)},${y-reSize(4.5)} 
    ${x+reSize(5)},${y} 
    ${x+reSize(3)},${y+reSize(4.5)} 
    ${x-reSize(3)},${y+reSize(4.5)} 
    ${x-reSize(5)},${y}`;
}

function convertToHex_Init(x, y) {
    return `
    ${x-5},${y-1000} 
    ${x-3},${y-4.5-1000} 
    ${x+3},${y-4.5-1000} 
    ${x+5},${y-1000} 
    ${x+3},${y+4.5-1000} 
    ${x-3},${y+4.5-1000} 
    ${x-5},${y-1000}`;
}

function OrderMapping_2(data) {
    if (data == "Population under 18 years")
        return 0;
    else if (data == "Population 18 to 34 years")
        return 1;
    else if (data == "Population 35 to 64 years")
        return 2;
    else if (data == "Population 65 to 74 years")
        return 3;
    else if (data == "Population 75 years and over")
        return 4;
};


var plot_2 = [];

var plot_main_2 = [];
var plot_hearing_2 = [];
var plot_vision_2 = [];
var plot_cognitive_2 = [];
var plot_ambulatory_2 = [];
var plot_self_2 = [];
var plot_independent_2 = [];
var plot_none_2 = [];



selectedVal_2 = "disabled";
var option_2 = selectedVal_2;


function changeView_2(circleInput = false, circleVal = '') {
    var selectedval_2 = ''
    if (circleInput) {
        selectedVal_2 = circleVal;

    } else {
        var select = d3.select('#DisabledSelect').node();
        // Get current value of select element, save to global chartScales
        selectedVal_2 = select.options[select.selectedIndex].value;
    }


    if (selectedVal_2 == 'disabled') {
        noneOpacity_2 = 0;
    } else {
        noneOpacity_2 = 0.8;

    }


    if (selectedVal_2 == 'disabled') {
        plot_2 = plot_main_2;
    } else if (selectedVal_2 == 'all') {
        plot_2 = plot_main_2;
    } else if (selectedVal_2 == 'Hearing') {
        plot_2 = plot_hearing_2;
    } else if (selectedVal_2 == 'Vision') {
        plot_2 = plot_hearing_2;
    } else if (selectedVal_2 == 'Cognitive') {
        plot_2 = plot_cognitive_2;
    } else if (selectedVal_2 == 'Ambulatory') {
        plot_2 = plot_ambulatory_2;
    } else if (selectedVal_2 == 'Self-care') {
        plot_2 = plot_self_2;
    } else if (selectedVal_2 == 'Independent Living') {
        plot_2 = plot_independent_2;
    } else if (selectedVal_2 == 'none') {
        plot_2 = plot_none_2;
    }
    // Update chart
    updateChart_2();
}






// ******************* Data stuff starts here!!! ************************



d3.json('plot_main.json').then(plotData => {
    plot_main_2 = plotData;
    plot_2 = plot_main_2;

    updateChart_2();

})

d3.json('plot_hearing.json').then(plotData => {
    plot_hearing_2 = plotData;



})

d3.json('plot_vision.json').then(plotData => {
    plot_vision_2 = plotData;



})

d3.json('plot_cognitive.json').then(plotData => {
    plot_cognitive_2 = plotData;


})

d3.json('plot_ambulatory.json').then(plotData => {
    plot_ambulatory_2 = plotData;


})

d3.json('plot_self-care.json').then(plotData => {
    plot_self_2 = plotData;


})

d3.json('plot_independent.json').then(plotData => {
    plot_independent_2 = plotData;

})

d3.json('plot_none.json').then(plotData => {
    plot_none_2 = plotData;
})



function updateChart_2() {

    d3.selectAll("svg > *").remove();
    var svg = d3.select('#age-svg');

    var lineG = svg.selectAll('.rect')
        .data(plot_2)
        .enter()
        .append('line')
        .attr("x1", x_2)
        .attr("y1", function (d, i) {
            return (y_2 + reSize(70 * i) + (i + 1) * (plotHeight_2 + reSize(40)));
        })
        .attr("x2", plotWidth_2 + x_2)
        .attr("y2", function (d, i) {
            return (y_2 + reSize(70 * i) + (i + 1) * (plotHeight_2 + reSize(40)));
        })
        .style('stroke', '#607173');

    var circleG = svg.selectAll('.hexagons')
        .data(plot_2)
        .enter()
        .append('g');

    var dots = circleG.selectAll('polyline')
        .data(function (d, i) {
            return d.values;
        });

    dots.enter()
        .append('polyline')
        .attr('class', d => {
            return 'unit ' + d['dis']
        })
        .attr('points', d => convertToHex_Final(reSize(d.x + 90), reSize(d.y)))
        .attr('data-disType', d => d['dis'])
        .style('fill', function (d, i) {
            return getColorByDisability_2(d['dis']);
        })
        .style('stroke', function (d, i) {
            return getColorByDisability_2(d['dis']);
        })
        .style('opacity', function (d, i) {
            return getOpacityByDisability_2(d['dis']);
        })
        .on('click', d => {
            console.log('hi');
            changeView_2(true, d.dis);
        })
        .exit()
        .remove();
    /*.selectAll('.unit')
    .transition()
    .ease(d3.easePolyIn.exponent(2))
    .duration(900)
    //.delay((d, i) => i * 6)
    .attr("points", d => convertToHex_Final(d.x,d.y));*/









    /////////////////////////////////////////////////////////////////////
    //                        X AXIS                                   //
    /////////////////////////////////////////////////////////////////////
    // Create x-scale for positioning the circles


    if (selectedVal_2 == "disabled" || selectedVal_2 == "all") {
        var xScale = d3.scaleBand()
            .domain(["Hearing Difficulty", "Vision Difficulty", "Cognitive Difficulty", "Ambulatory Difficulty", "Self-care Difficulty", "Independent living difficulty"])
            //.range([100,1000]);
            .range([margin_2.left + axis_2.l + reSize(75), chartWidth_2 - reSize(50)]);


        var xAxis = d3.axisTop(xScale);
        xAxis.tickSize(0);

        svg.append('g') // Append a g element for the scale
            .attr('class', 'x axis') // Use a class to css style the axes together
            .attr('transform', 'translate(0,' + margin_2.top + ')') // Position the axis
            .call(xAxis) // Call the axis function
            .style("font-size", "11")
            .style("font-family", "Avenir Next")
            .style("font-weight", "600")
            .style("color", "#607173")
            .call(g => g.selectAll(".tick text")
                .attr("dy", -5));
    } else {
        //Legend
        var legendLabels = ["Hearing", "Vision", "Cognitive", "Ambulatory", "Self-care", "Independent Living", "No Disability"];
        var legendCircles = svg.selectAll('.legendCircle')
            .data(legendLabels)
            .enter()
            .append('circle')
            .attr("r", "7")
            .attr("cx", 780)
            .attr("cy", function (d, i) {
                return 20 * i + 40;
            })
            .style("fill", function (d) {
                if (d == "No Disability")
                    return colorMapping_2["none"];
                else
                    return colorMapping_2[d];
            });
        var p = svg.selectAll('.legendTextt')
            .data(legendLabels)
            .enter()
            .append("text")
            .text(function (d, i) {
                return d;
            })
            .attr('font-family', 'Avenir Next')
            .style('stroke', '#607173')
            .style('font-size', '11px')
            .attr('transform', function (d, i) {
                return 'translate(800,' + (20 * i + 45) + ')';
            });
    }



    /////////////////////////////////////////////////////////////////////
    //                        Y AXIS                                   //
    /////////////////////////////////////////////////////////////////////
    var yScale = d3.scaleBand()
        .domain(['Under 18 yrs', '18 - 34 yrs', '35 - 64 yrs', '65 - 74 yrs', 'Above 75 yrs'])
        .range([y_2 - reSize(20), (betweenAge_2) * 5 + reSize(130)]);
    var yAxisLeft = d3.axisLeft(yScale);
    yAxisLeft.tickSize(0);
    svg.append('g') // Append a g element for the scale
        .attr('class', 'y axis') // Use a class to css style the axes together
        .attr('transform', 'translate(' + [margin_2.left + axis_2.l, 0] + ')') // Position the axis
        .call(yAxisLeft) // Call the axis function
        .style("font-size", "11px")
        .style("font-family", "Avenir Next")
        .style("font-weight", "600")
        .style("color", "#607173")
        //.call(g => g.select(".domain").remove()); //to remove the axis line
        .call(g => g.selectAll(".tick text")
            .attr("dx", -5));

    var yAxisRight = d3.axisRight(yScale);
    yAxisRight.tickSize(0);
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + [svgWidth_2 - margin_2.right, 0] + ')')
        .style("color", "#607173")
        .call(yAxisRight)
        .call(g => g.selectAll(".tick text").remove());






}





function getColorByDisability_2(disability) {
    return colorMapping_2[disability];
}


function getOpacityByDisability_2(disability) {
    if (disability == "none")
        return noneOpacity_2;

    else
        return otherOpacity_2;

}

function reSize(x) {
    return 0.45 * x;
}