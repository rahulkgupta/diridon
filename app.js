var margin = {top: 0, right: 20, bottom: 20, left: 20},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .domain([0, 24])
    .range([0, width])

x.ticks(1);

//set domains
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 60])

var weekday = d3.select("#weekday").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cValue = function(d) { return d.operator;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

weekday.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)

weekday.append("g")
    .attr("class", "y axis")
    .call(yAxis)

function placeStops (data) {
  weekday.selectAll(".dot")
    .data(data)
  .enter().append("circle")
    .filter(function (d) {
      return d.schedule == "weekday";
    })
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) {
      var timeArr = d.time.split(":");
      return x(timeArr[0]);
    })
    .attr("cy", function(d) {
      return y(d.time.split(":")[1]);
    })
    .style("fill", function(d) { return color(cValue(d));})

  // caltrainWeekend.selectAll(".dot")
  //   .data(data)
  // .enter().append("circle")
  //   .filter(function (d) {
  //     return d.schedule == "weekend";
  //   })
  //   .attr("class", "dot")
  //   .attr("r", 3.5)
  //   .attr("cx", function(d) {
  //     var timeArr = d.time.split(":");
  //     return x(new Date(2016, 6, 28, timeArr[0], timeArr[1]));
  //   })
  //   .attr("cy", function(d) { return y(d.direction); })
  //   .style("fill", function(d) { return color(cValue(d));})
  //

}


// var caltrainWeekend = d3.select("#caltrain-weekend").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//

d3.csv("diridon.csv", placeStops);
