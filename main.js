
//**********  Viz 2: Matrix of age group vs disability type  **************


//Setting up chart layout
var svgWidth = 2000;
var svgHeight = 2000;

var margin = {top: 100, right: 50, bottom: 100, left: 50};  // Define a padding object
var axis = {l: 50, t: 50}; // Leaving space for drawing axes and their labels



// Compute the dimensions of the chart
chartWidth = svgWidth - margin.left - margin.right;
chartHeight = svgHeight - margin.top - margin.bottom;


//Actual chart for the circles (excluding the axes)
plotWidth = chartWidth - axis.l - 25;
plotHeight = 200; // for each age group

const spacing = {
    "Population under 18 years": 5.3,
    "Population 18 to 34 years": 6.66,
    "Population 35 to 64 years": 1.9,
    "Population 65 to 74 years": 18.6,
    "Population 75 years and over": 30.5,
    "disability": 2
}

//Global variables
let nestedData;
var NumberByAgeDisability = [];
var betweenDots = 2;
var betweenAge = 300;
var dotRadius = 5;
//var circlesInColumn = ~~(plotHeight/(2*dotRadius+ spacing["Population under 18 years"]));



var column = 0; // Even and odd rows have different starting x positions to allow for staggering
var columnX = [];
var count = -1;


//center position for 1st circle
var y = dotRadius + margin.top + axis.t; 
var x = 15+ dotRadius + margin.left+ axis.l;


var FirstCircleY = y;
var FirstCircleX = x;
var currentY = y;


const peopleUnit = 50000;
var colorMapping = {
    "Hearing": "red",
    "Vision": "orange",
    "Cognitive": "pink",
    "Ambulatory": "green",
    "Self-care": "blue",
    "Independent Living": "purple",
    "none": "white",
}






function OrderMapping(data){
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


var toDraw = [];
var plotted = [];
var plot=[];


var selectedVal = "disabled";
var option = selectedVal;


function changeView(circleInput = false, circleVal = '')
{
    var selectedval = ''
    if(circleInput){
        selectedVal = circleVal;

    }
    else{
        var select = d3.select('#DisabledSelect').node();
    // Get current value of select element, save to global chartScales
        selectedVal = select.options[select.selectedIndex].value;
    }

    
    if(selectedVal == 'disabled'){
        colorMapping = {
        "Hearing": "red",
        "Vision": "orange",
        "Cognitive": "pink",
        "Ambulatory": "green",
        "Self-care": "blue",
        "Independent Living": "purple",
        "none": "white",
    };
    }
    else{
        colorMapping = {
        "Hearing": "red",
        "Vision": "orange",
        "Cognitive": "pink",
        "Ambulatory": "green",
        "Self-care": "blue",
        "Independent Living": "purple",
        "none": "grey",
    };
    }
    // Update chart
    dataOrg();
}






// ******************* Data stuff starts here!!! ************************

d3.csv('./Age_vs_disabilityType.csv').then(data => {
    
    console.log(data[0].age);
    data.forEach(function(d){
        
        //preparing data for visual mapping
        for(i=0; i<~~(+d['number']/peopleUnit); i++) // Using '~~' rounds decimals to closest integer
        {

            NumberByAgeDisability.push({
                'ageGroup' : d.age,
                'dis' : d.disability,
            });
        }
    })

    dataOrg();  
});    






function dataOrg()

{
    nestedData = d3.nest()
        .key(d => d.ageGroup)
        .key(d => d.dis)
        .object(NumberByAgeDisability);

    console.log(nestedData);
    option = selectedVal;
    
    function splitEqual(myArray, Nblocks){
        var index = 0;
        var arrayLength = myArray.length;
        var splitArray = [];
        
        blockSize = arrayLength/Nblocks;

        for (index = 0; index < arrayLength; index += blockSize) {
            block = myArray.slice(index, index + blockSize);
            // Do something if you want with the group
            splitArray.push(block);
        }

        return splitArray;
    }

    
    splitNones = {};
    for (let age in nestedData)
    {

        splitNones[age] = splitEqual(nestedData[age]["none"], Object.keys(nestedData[age]).length);
    }



    var i =0;
    for (let age in nestedData)
    {   
        
        

        if (selectedVal == "disabled" || selectedVal == "all")
        {   
            if (age == "Population under 18 years")
                toDraw[i] = splitNones[age][0].concat(nestedData[age]["Hearing"], splitNones[age][1], nestedData[age]["Vision"], splitNones[age][2],nestedData[age]["Cognitive"],splitNones[age][3], nestedData[age]["Ambulatory"],splitNones[age][4], nestedData[age]["Self-care"],splitNones[age][5]);

            else
                toDraw[i] = splitNones[age][0].concat(nestedData[age]["Hearing"], splitNones[age][1], nestedData[age]["Vision"], splitNones[age][2],nestedData[age]["Cognitive"],splitNones[age][3], nestedData[age]["Ambulatory"],splitNones[age][4], nestedData[age]["Self-care"],splitNones[age][5], nestedData[age]["Independent Living"],splitNones[age][6]);
        }
 
       
        
        else
        {   
            if (nestedData[age][selectedVal] != undefined )
            {
                
                toDraw[i]=nestedData[age][selectedVal];
                for (let dis in nestedData[age])
                {
                    if (nestedData[age][dis] != nestedData[age][selectedVal])
                        toDraw[i]=toDraw[i].concat(nestedData[age][dis]);

                }
            }

            else
            {
                toDraw[i]=nestedData[age]["Hearing"];
                toDraw[i] = toDraw[i].concat(nestedData[age]["Vision"], nestedData[age]["Cognitive"], nestedData[age]["Ambulatory"], nestedData[age]["Self-care"], nestedData[age]["none"]);
            }
        }    

        i++;
        
    }

    plotted = toDraw.flat(); // remove nesting

    plot = d3.nest()
        .key(d => d.ageGroup)
        .entries(plotted);  // add nesting

    updateChart();
}





function updateChart() 
{

    d3.selectAll("svg > *").remove();
    var svg = d3.select('svg');

    var lineG = svg.selectAll('.rect')
        .data(toDraw)
        .enter()
        .append('line')
        .attr("x1", x)
        .attr("y1", function(d,i){
            return (y + 70*i+ (i +1)*(plotHeight+40));
        })
        .attr("x2", plotWidth+x)
        .attr("y2", function(d,i){
            return (y + 70*i+(i +1)*(plotHeight+40));
        })
        .style('stroke','black');

    var circleG = svg.selectAll('.circles')
        .data(plot)
        .enter()
        .append('g');

    var dots = circleG.selectAll('circle')
        .data(function(d,i){
              
             return d.values;
        });

    dots.enter()
        .append('circle')
        .attr('class', d => { return 'unit ' + d['dis']})

        .attr('cy', function(d, i){
            if (i==0)
            {
                FirstCircleY = ( y  + (betweenAge)*OrderMapping(d['ageGroup']));
                column=0;
                columnX.push(column);
                return FirstCircleY;
            } 

            if (FirstCircleY >= ( y  + (betweenAge*(OrderMapping(d['ageGroup']))) + plotHeight))
            {
                column++;
                if (column%2 != 0)
                    FirstCircleY = ( y  + betweenAge*OrderMapping(d['ageGroup']) + dotRadius + (spacing[d['ageGroup']]/2))
                   

                else
                    FirstCircleY = y  + betweenAge*OrderMapping(d['ageGroup']);
                columnX.push(column);
                return FirstCircleY;
            }

            else
            {
                FirstCircleY = FirstCircleY + (2*dotRadius+ getSpacingByAge(d));
                columnX.push(column);
                return FirstCircleY;
            }

        })
        .attr('cx', function(d, i){
            count++;
            if (columnX[count] == 0)
            {
                FirstCircleX =x;
            }

            else if (columnX[count] != columnX[count -1])
            {

                FirstCircleX = FirstCircleX + (2*dotRadius + getSpacingByAge(d));
            }
            return FirstCircleX;

        })
        .attr('r', dotRadius)
        .attr('data-disType', d => d['dis'])
        .style('fill', function(d, i){ return getColorByDisability(d['dis']); })
        .style('stroke', function(d, i){ return getColorByDisability(d['dis']); })
        .on('click', d =>{
            console.log(d);
            changeView(true, d.dis);
        });

        dots.exit()
            .remove();



        /////////////////////////////////////////////////////////////////////
        //                        X AXIS                                   //
        /////////////////////////////////////////////////////////////////////
        // Create x-scale for positioning the circles


        if (selectedVal == "disabled" || selectedVal=="all")
        {
            var xScale = d3.scaleBand()
            .domain(["Hearing Difficulty", "Vision Difficulty", "Cognitive Difficulty", "Ambulatory Difficulty", "Self-care Difficulty", "Independent living Difficulty"])
            //.range([100,1000]);
            .range([margin.left + axis.l +75, chartWidth -50]);


            var xAxis = d3.axisTop(xScale);
            xAxis.tickSize(0);

            svg.append('g') // Append a g element for the scale
                    .attr('class', 'x axis') // Use a class to css style the axes together
                    .attr('transform', 'translate(0,'+margin.top+')') // Position the axis
                    .call(xAxis) // Call the axis function
                    .style("font","14px times")
                    .style("font-family","sans-serif")
                    .call(g => g.selectAll(".tick text")
                    .attr("dy", -5)); 
        }



        /////////////////////////////////////////////////////////////////////
        //                        Y AXIS                                   //
        /////////////////////////////////////////////////////////////////////
        var yScale = d3.scaleBand()
                        .domain(['Under 18 yrs','18 - 34 yrs','35 - 64 yrs','65 - 74 yrs','Above 75 yrs'])
                        .range([y-20,(betweenAge)*5 + 150 ]);
        var yAxisLeft = d3.axisLeft(yScale);
        yAxisLeft.tickSize(0);
        svg.append('g') // Append a g element for the scale
                .attr('class', 'y axis') // Use a class to css style the axes together
                .attr('transform', 'translate('+[ margin.left+axis.l,0]+')') // Position the axis
                .call(yAxisLeft) // Call the axis function
                .style("font","14px times")
                .style("font-family","sans-serif")
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


}   




function getSpacingByAge(d)
{

    if ((option == "disabled" || option == "all") && d['dis'] == "none")
        return spacing[d['ageGroup']];

    else
        return spacing["disability"];

}


function getColorByDisability(disability)
{
    return colorMapping[disability];
}



