var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var svg = d3.select('#vis-container svg');
var svgWidth = $('#vis-container .vis svg').width();
var svgHeight = $('#vis-container .vis svg').height();

/////////////////////////////////////////////////////////////////////
//                        X AXIS                                   //
/////////////////////////////////////////////////////////////////////
// Create x-scale for positioning the circles
var xScale = d3.scaleBand()
    .domain(["Hearing Difficulty", "Vision Difficulty", "Cognitive Difficulty", "Ambulatory Difficulty", "Self-care Difficulty", "Independent living Difficulty"])
    //.range([100,1000]);
    .range([margin.left, svgWidth - margin.right]);


var xAxis = d3.axisTop(xScale);
xAxis.tickSize(0);

svg.append('g') // Append a g element for the scale
        .attr('class', 'x axis') // Use a class to css style the axes together
        .attr('transform', 'translate(0,'+margin.top+')') // Position the axis
        .call(xAxis) // Call the axis function
        .call(g => g.selectAll(".tick text")
        .attr("dy", -5)); 


/////////////////////////////////////////////////////////////////////
//                        Y AXIS                                   //
/////////////////////////////////////////////////////////////////////
var yScale = d3.scaleBand()
                .domain(['Under 18 yrs','18 - 34 yrs','35 - 64 yrs','65 - 74 yrs','Above 75 yrs'])
                .range([margin.top,svgHeight - margin.bottom]);
var yAxisLeft = d3.axisLeft(yScale);
yAxisLeft.tickSize(0);
svg.append('g') // Append a g element for the scale
        .attr('class', 'y axis') // Use a class to css style the axes together
        .attr('transform', 'translate('+[ margin.left,0]+')') // Position the axis
        .call(yAxisLeft) // Call the axis function
        //.call(g => g.select(".domain").remove()); //to remove the axis line
        .call(g => g.selectAll(".tick text")
        .attr("dx", -5)); 

var yAxisRight = d3.axisRight(yScale);
yAxisRight.tickSize(0);
svg.append('g')
    .attr('class','y axis')
    .attr('transform', 'translate('+[svgWidth-margin.right,0]+')')
    .call(yAxisRight)
    .call(g => g.selectAll(".tick text").remove());

/////////////////////////////////////////////////////////////////////
//                        HRZTL LINES                              //
/////////////////////////////////////////////////////////////////////

var hLinesData=[1,2,3,4,5]
var hLines = d3.select('svg').selectAll('.hLines').data(hLinesData);
//var hLineSpacing = 100;
var hLineSpacing = (yScale.range()[1] - yScale.range()[0])/hLinesData.length;
var hLinesEnter = hLines.enter()
                        .append('g')
                        .attr('class','hLines')
                        .attr('transform', function(d) {
                            return 'translate('+[0, d * hLineSpacing]+')';
                        });

hLinesEnter.append('line')
        .attr("x1", xScale.range()[0]) //min val of xScale's range (i.e. margin.left)
        .attr("y1", margin.top )
        .attr("x2", xScale.range()[1]) //max val of xScale's rangle (i.e. svgWidth - margin.right)
        .attr("y2", margin.top);

