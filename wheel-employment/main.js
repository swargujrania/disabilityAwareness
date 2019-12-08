var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var a,b;
const PEOPLE_UNIT = 100000;

let units = [];
let dataset;
let buckets = [];
var spokes;
var labels1;
var labels2;
var labels3;

// var pie = d3.pie()
//       .startAngle(-90 * Math.PI/180)
//       .endAngle(-90 * Math.PI/180 + 2*Math.PI)
//       .value(function(d) { return d.value; })
//       .padAngle(.01)
//       .sort(null);

// var donutData = [
//       {name: "Antelope",  value: 15},
//       {name: "Bear",    value: 9},
//       {name: "Cheetah",   value: 19},
//       {name: "Dolphin",   value: 12},
//       {name: "Elephant",  value: 14},
//       {name: "Flamingo",  value: 21},
//       {name: "Giraffe", value: 18},
//       {name: "Other",   value: 8}
//     ];      
start = () => {

var svg = d3.select('#vis-container svg');
var svgWidth = $('#vis-container .vis svg').width();
var svgHeight = $('#vis-container .vis svg').height();

var wheel = d3.select('svg')
			.append('g')
			.attr('class','wheel');

var hub_r = 100;
var hub_cx = svgWidth/2;
var hub_cy = svgHeight/2+margin.top/2-100;

var hub = wheel.append('circle')
			.attr('class','hub')
			.attr('r',hub_r)
			.attr('cx',hub_cx)
			.attr('cy',hub_cy)
			.attr('fill','none')
			.attr('stroke','#ccc');

var spokesData = [1,2,3,4,5,6,7,8,9,10,11,12,13];	// number of industry types

 var spoke_length = 250;
// var spoke_x1 =  hub_cx + hub_r * Math.cos(d*2*Math.PI/spokesData.length);
// var spoke_y1 = hub_cy - hub_r * Math.sin(d*2*Math.PI/spokesData.length);
// var spoke_x2 = hub_cx + (hub_r + spoke_length)*Math.cos(d*2*Math.PI/spokesData.length);
// var spoke_y2 = hub_cy - (hub_r + spoke_length)*Math.sin(d*2*Math.PI/spokesData.length);

 spokes = wheel.selectAll('.spokes')
				.data(spokesData)
				.enter()
				.append("line")
				.attr('x1',function(d){
					return hub_cx + hub_r * Math.cos(d*2*Math.PI/spokesData.length);	//spoke_x1
				})
				.attr('y1',function(d){
					return hub_cy - hub_r * Math.sin(d*2*Math.PI/spokesData.length);	//spoke_y1
				})
				.attr('x2',function(d){
					return hub_cx + (hub_r + spoke_length)*Math.cos(d*2*Math.PI/spokesData.length);	//spoke_x2
				})
				.attr('y2',function(d){
					return hub_cy - (hub_r + spoke_length)*Math.sin(d*2*Math.PI/spokesData.length);	//spoke_y2
				})
				.attr('stroke','#ccc');				
  d3.csv('./industry2018.csv').then(data => {
    let nestedData = d3.nest()
      .key(d => d.industry)
      .entries(data);

    // nestedData.splice(0, 1);
    nestedData.pop();

    dataset = nestedData;
    console.log(dataset);

    var prevTheta = 0;
    for (let i = 0; i < spokesData.length; i++) {
      let x1 = $($('.wheel > line')[i]).attr('x1');
      let x2 = $($('.wheel > line')[i]).attr('x2');
      let y1 = $($('.wheel > line')[i]).attr('y1');
      let y2 = $($('.wheel > line')[i]).attr('y2');
      let theta1 = prevTheta;
      let theta2 = (i+1)*2*Math.PI/spokesData.length;
      let label = dataset[i].key;
      buckets[i] = new Bucket(x1, y1, x2, y2, theta1, theta2,label);
      prevTheta = theta2;
      //buckets[i].showLabel(svg);
    }

    for (let k = 0; k < dataset.length; k++) {
        let bracket = dataset[k];
        bracket.DisabilityCount = 0;
        bracket.WoDisabiltyCount = 0;
        for (let item of bracket.values) {
          if (item.disabilityType == "With a Disability") {
            bracket.DisabilityCount += +item.numbers;
          } else if (item.disabilityType == "No Disability") {
            bracket.WoDisabiltyCount += +item.numbers;
          }
        }
        bracket.DisabilityCount = Math.floor(bracket.DisabilityCount);
        bracket.WoDisabiltyCount = Math.floor(bracket.WoDisabiltyCount);

        let unit1 = {
          bracket: bracket.key,
          status: "With a Disability"
        }
        let unit2 = {
          bracket: bracket.key,
          status: "No Disability"
        }
        let t = 7;
        let radius = hub_r + 3.5;
        let PrevAngle = Math.asin(t/(2*radius)) + buckets[k].theta1;
        angle = PrevAngle;
        // let prevX = x1;
        // let prevY = buckets[k].y - 4;
        for (let i = 0; i < bracket.DisabilityCount / PEOPLE_UNIT; i++) {
  	      
  	     let x = hub_cx + radius * Math.cos(angle);
  	     let y = hub_cy - radius * Math.sin(angle);
  	  	   angle+=2*Math.asin(t/(2*radius));
    		if (angle > buckets[k].theta2) {
    			radius += t;
    	     	angle = Math.asin(t/(2*radius)) + buckets[k].theta1;
    	     
      	}
           
           let unit = new Unit(unit1, x, y,angle);
        	 units.push(unit);
        	
         }

        for (let i = 0; i < bracket.WoDisabiltyCount / PEOPLE_UNIT; i++) {
           
    	     let x = hub_cx + radius * Math.cos(angle);
    	     let y = hub_cy - radius * Math.sin(angle);
    	  	   angle+=2*Math.asin(t/(2*radius));
      		if (angle > buckets[k].theta2) {
      			radius += t;
      	     	angle = Math.asin(t/(2*radius)) + buckets[k].theta1;
      	     
        	}
             
             let unit = new Unit(unit2, x, y,angle);
          	 units.push(unit);
         
        }
	   }
    

    svg.selectAll('.unit')
      .data(units)
      .enter()
      .append('circle')
      .attr('class', 'unit')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 3)
      .style('stroke', 'F2BDB6')
      .attr('fill', d => {
        if (d.status == "With a Disability") {
          return 'rgb(242,189,182)';
        } else {
          return 'white';
        }
      });

      
      labels1 = ["Public administration", "Other services ", "Arts, entertainment, and  ","Educational services, ", "Professional, scientific, and ", 
     "Finance and insurance, " ,"Information","Transportation and ","Retail trade" ,"Wholesale trade","Manufacturing"
      ,"Construction","Agriculture, forestry,"];
      labels2 = ["","(except public ", "recreation, and accommodation","and health care and","management, and administrative","and real estate and","","warehousing, and utilities","","",
      "","","fishing and hunting,"];
      labels3 = ["","administration)","and food services", " social assistance","and waste management services","rental and leasing",
      "", "", "","","", "","and mining"];
      var outerCircleRadius1 = 4.1 *hub_r;
      var outerCircleRadius2 = 3.9 * hub_r;
      var outerCircleRadius3 = 3.7 * hub_r;
      
      // var outerCircleLabel1 = wheel.append('circle')
      // .attr('class','outerCircle')
      // .attr('r',outerCircleRadius1)
      // .attr('cx',hub_cx)
      // .attr('cy',hub_cy)
      // .attr('fill','none')
      // .attr('stroke','#ccc');

      // var outerCircleLabel2 = wheel.append('circle')
      // .attr('class','outerCircle')
      // .attr('r',outerCircleRadius2)
      // .attr('cx',hub_cx)
      // .attr('cy',hub_cy)
      // .attr('fill','none')
      // .attr('stroke','#ccc');

      // var outerCircleLabel3 = wheel.append('circle')
      // .attr('class','outerCircle')
      // .attr('r',outerCircleRadius3)
      // .attr('cx',hub_cx)
      // .attr('cy',hub_cy)
      // .attr('fill','none')
      // .attr('stroke','#ccc');


      var start_x = hub_cx - 350;
      var start_y = hub_cy;
      var end_x = hub_cx + 350;
      var end_y = hub_cy;

    function polarToCartesian(centerX, centerY, radius, angleInRadians) {
      //var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
      return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle + Math.PI);
    var end = polarToCartesian(x, y, radius, startAngle + Math.PI);
    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, 1, 1, end.x, end.y
    ].join(" ");
    return d;       
    }


    var arcs1 = svg.selectAll(".arcs")
        .data(buckets)
        .enter()
        .append("path")
        .attr("fill","none")
        .attr("id", function(d,i){return "s"+i;})
        .attr("d",function(d,i) {
            return describeArc(hub_cx, hub_cy, outerCircleRadius1, d.theta1, d.theta2);
        } )
        .style("stroke", "#AAAAAA")
        .attr("stroke-opacity", 0)
        .style("stroke-dasharray", "5,5")
    //     .each(function(d,i) {
    //   //Search pattern for everything between the start and the first capital L
    //   var firstArcSection = /(^.+?)L/;  

    //   //Grab everything up to the first Line statement
    //   var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
    //   //Replace all the comma's so that IE can handle it
    //   newArc = newArc.replace(/,/g , " ");
      
    //   //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
    //   //flip the end and start position
    //   if (d.theta2 > 90 * Math.PI/180) {
    //     var startLoc  = /M(.*?)A/,    //Everything between the first capital M and first capital A
    //       middleLoc   = /A(.*?)0 0 1/,  //Everything between the first capital A and 0 0 1
    //       endLoc    = /0 0 1 (.*?)$/; //Everything between the first 0 0 1 and the end of the string (denoted by $)
    //     //Flip the direction of the arc by switching the start en end point (and sweep flag)
    //     //of those elements that are below the horizontal line
    //     var newStart = endLoc.exec( newArc )[1];
    //     var newEnd = startLoc.exec( newArc )[1];
    //     var middleSec = middleLoc.exec( newArc )[1];
        
    //     //Build up the new arc notation, set the sweep-flag to 0
    //     newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
    //   }//if
      
    //   //Create a new invisible arc that the text can flow along
    //   svg.append("path")
    //     .attr("class", "hiddenDonutArcs")
    //     .attr("id", "donutArc"+i)
    //     .attr("d", newArc)
    //     .style("fill", "none");
    // });
    
    var arcs2 = svg.selectAll(".arcs")
        .data(buckets)
        .enter()
        .append("path")
        .attr("fill","none")
        .attr("id", function(d,i){return "t"+i;})
        //.attr("id","huhue")
        // .attr("d", function(d,i) {
        //     return describeArc(d.x, d.y, d.r, 160, -160)
        // } );
        .attr("d",function(d,i) {
            return describeArc(hub_cx, hub_cy, outerCircleRadius2, d.theta1, d.theta2);
        } )//"M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y)
        .style("stroke", "#AAAAAA")
        .attr("stroke-opacity", 0)
        .style("stroke-dasharray", "5,5");

    var arcs3 = svg.selectAll(".arcs")
        .data(buckets)
        .enter()
        .append("path")
        .attr("fill","none")
        .attr("id", function(d,i){return "u"+i;})
        //.attr("id","huhue")
        // .attr("d", function(d,i) {
        //     return describeArc(d.x, d.y, d.r, 160, -160)
        // } );
        .attr("d",function(d,i) {
            return describeArc(hub_cx, hub_cy, outerCircleRadius3, d.theta1, d.theta2);
        } )//"M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y)
        .style("stroke", "#AAAAAA")
        .attr("stroke-opacity", 0)
        .style("stroke-dasharray", "5,5");

    var textArc1 = svg.selectAll(".industryLabels")
      .data(labels1)
      .enter()
      .append("text")
      .style("text-anchor","middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href",function(d,i){
        return "#s"+i;
      })
      .attr("startOffset",function(d,i){return "50%";}) //place the text halfway on the arc
      .text(function(d,i){return d;});
    
    var textArc2 = svg.selectAll(".industryLabels")
      .data(labels2)
      .enter()
      .append("text")
      .style("text-anchor","middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href",function(d,i){
        return "#t"+i;
      })
      .attr("startOffset",function(d,i){return "50%";}) //place the text halfway on the arc
      .text(function(d,i){return d;});

    var textArc3 = svg.selectAll(".industryLabels")
      .data(labels3)
      .enter()
      .append("text")
      .style("text-anchor","middle")
      .append("textPath")        //append a textPath to the text element
      .attr("xlink:href",function(d,i){
        return "#u"+i;
      })
      .attr("startOffset",function(d,i){return "50%";}) //place the text halfway on the arc
      .text(function(d,i){return d;});


  }); //d3.csv end braces

} //start event end braces

class Bucket {
  constructor(x1, y1, x2, y2, theta1, theta2, label) {
    this.label = label;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.theta1 = theta1;
    this.theta2 = theta2;
  }
}

class Unit {
  constructor(unit, x, y, angle) {
    this.status = unit.status;
    this.bracket = unit.bracket;
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}













