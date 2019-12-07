var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var a,b;
const PEOPLE_UNIT = 100000;

let units = [];
let dataset;
let buckets = [];
var spokes;

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

      var outerCircle = wheel.append('circle')
      .attr('class','outerCircle')
      .attr('r',4*hub_r)
      .attr('cx',hub_cx)
      .attr('cy',hub_cy)
      .attr('fill','none')
      .attr('stroke','#ccc');

      var start_x = hub_cx - 350;
      var start_y = hub_cy;
      var end_x = hub_cx + 350;
      var end_y = hub_cy;

//     function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//     var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
//     return {
//         x: centerX + (radius * Math.cos(angleInRadians)),
//         y: centerY + (radius * Math.sin(angleInRadians))
//     };

//     function describeArc(x, y, radius, startAngle, endAngle){
//     var start = polarToCartesian(x, y, radius, endAngle);
//     var end = polarToCartesian(x, y, radius, startAngle);
//     var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
//     var d = [
//         "M", start.x, start.y, 
//         "A", radius, radius, 0, 1, 1, end.x, end.y
//     ].join(" ");
//     return d;       
//   }
//     var arcs = svg.append("path")
//         .attr("fill","none")
//         //.attr("id", function(d,i){return "s"+i;})
//         .attr("id","huhue")
//         // .attr("d", function(d,i) {
//         //     return describeArc(d.x, d.y, d.r, 160, -160)
//         // } );
//         .attr("d","M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y);


//     var textArc = svg.append("text")
//       .style("text-anchor","middle")
//       .append("textPath")        //append a textPath to the text element
//       .attr("xlink:href","#huehue")
//       .attr("startOffset", "50%")   //place the text halfway on the arc
//       .text("Yay gsdhsgdjv, my text is moving back & forth");
    

//       // var labels = arcPaths.append("text")
//       // // .style("opacity", function(d) {
//       // //       if (d.depth == 0) {
//       // //         return 0.0;
//       // //     }
//       // //       if (!d.children) {
//       // //           return 0.0;
//       // //       }
//       // //       var sumOfChildrenSizes = 0;
//       // //       d.children.forEach(function(child){sumOfChildrenSizes += child.size;});
//       // //       //alert(sumOfChildrenSizes);
//       // //       if (sumOfChildrenSizes <= 5) {
//       // //           return 0.0;
//       // //       }
//       // //       return 0.8;
//       // //   })
//       // .attr("font-size",10)
//       // .style("text-anchor","middle")
//       // .append("textPath")
//       // .attr("xlink:href",function(d,i){return "#s"+i;})
//       // .attr("startOffset",function(d,i){return "50%";})
//       // //.text(function(d){return d.name.toUpperCase();})
//       // .text("HIHIHI");

// }
//       //Create an SVG arc starting at location [0,300], ending at [400,300] with a radius of 200 (circle)			
// 		// var path = svg.append("path")
// 		// 	.attr("id", "wavy") //A unique ID to reference later
// 		// 	.attr("d", "M"+start_x+","+start_y+", A"+500+","+500+" 0 0,1 "+end_x+","+end_y) //Notation for an SVG path
// 		// 	.style("fill", "none")
// 		// 	.style("stroke", "#AAAAAA")
// 		// 	.style("stroke-dasharray", "5,5");

// 		// //Create an SVG text element and append a textPath element
// 		// var textArc = svg.append("text")
// 		// 	.style("text-anchor","middle")
// 		//   .append("textPath")				//append a textPath to the text element
// 		// 	.attr("xlink:href", "#wavy") 	//place the ID of the path here
// 		// 	.attr("startOffset", "50%")		//place the text halfway on the arc
// 		// 	.text("Yay, my text is moving back & forth");
		


});
}

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













