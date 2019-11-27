var margin = { top: 100, left: 100, bottom: 20, right: 100 };

var svg = d3.select('#vis-container svg');
var svgWidth = $('#vis-container .vis svg').width();
var svgHeight = $('#vis-container .vis svg').height();

var wheel = d3.select('svg')
			.append('g')
			.attr('class','wheel');

var hub_r = 100;
var hub_cx = svgWidth/2;
var hub_cy = svgHeight/2+margin.top/2;

var hub = wheel.append('circle')
			.attr('class','hub')
			.attr('r',hub_r)
			.attr('cx',hub_cx)
			.attr('cy',hub_cy)
			.attr('fill','none')
			.attr('stroke','#ccc');

var spokesData = [1,2,3,4,5,6,7,8,9,10,11,12,13];	// number of industry types

 var spoke_length = 100;
// var spoke_x1 =  hub_cx + hub_r * Math.cos(d*2*Math.PI/spokesData.length);
// var spoke_y1 = hub_cy - hub_r * Math.sin(d*2*Math.PI/spokesData.length);
// var spoke_x2 = hub_cx + (hub_r + spoke_length)*Math.cos(d*2*Math.PI/spokesData.length);
// var spoke_y2 = hub_cy - (hub_r + spoke_length)*Math.sin(d*2*Math.PI/spokesData.length);

var temp1= wheel.selectAll('.spokes')
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
