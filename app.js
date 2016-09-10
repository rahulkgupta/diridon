// var xScale = new Plottable.Scales.Category();
// var yScale = new Plottable.Scales.Linear();
// var data = [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 },
//             { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 6, y: 5 }];


// var margin = {top: 20, right: 20, bottom: 20, left: 20},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// var x = d3.scaleLinear()
//     .domain([0, 24])
//     .range([0, width])
//
// x.ticks(1);
//
// //set domains
// var y = d3.scaleLinear()
//     .range([height, 0])
//     .domain([0, 60])
//
// var weekday = d3.select("#weekday").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var cValue = function(d) { return d.operator;},
//     color = d3.scaleOrdinal(d3.schemeCategory10);
//
// var xAxis = d3.axisBottom(x)
//   .tickSizeInner(-height);
// var yAxis = d3.axisLeft(y)
//   .tickSizeInner(-width);
//
// weekday.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//   .append("text")
//     .attr("x", width-100)
//     .style("text-anchor", "end")
//     .text("Hour")
//
// weekday.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//
// function placeStops (data) {
//   weekday.selectAll(".dot")
//     .data(data)
//   .enter().append("circle")
//     .filter(function (d) {
//       return d.schedule == "weekday";
//     })
//     .attr("class", "dot")
//     .attr("r", 3.5)
//     .attr("cx", function(d) {
//       var timeArr = d.time.split(":");
//       return x(timeArr[0]);
//     })
//     .attr("cy", function(d) {
//       return y(d.time.split(":")[1]);
//     })
//     .on("mouseover", function (d) {
//       console.log(d);
//     })
//     .style("fill", function(d) { return color(cValue(d));})
//
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

// }


// var caltrainWeekend = d3.select("#caltrain-weekend").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//

d3.csv("weekday.csv", function (data) {
  var yScale = new Plottable.Scales.Linear().domain([-5, 60]);
  var xScale = new Plottable.Scales.Linear().domain([0, 24]);

  var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
  var yAxis = new Plottable.Axes.Numeric(yScale, "left");

  var colorScale = new Plottable.Scales.Color()
    .domain(["vta", "ace", "caltrain"])
    .range(["#028E9B", "#A67000", "#FF0D00"]);

  var legend = new Plottable.Components.Legend(colorScale)
    .yAlignment("center")

  var plot = new Plottable.Plots.Scatter()
    .addDataset(new Plottable.Dataset(data))
    .x(function(d) {
      return d.time.split(":")[0];
    }, xScale)
    .y(function(d) {
      return d.time.split(":")[1];
    }, yScale)
    .attr("opacity", 1)
    .attr("fill", function (d) {
      return d.direction == "sb" || d.direction == "wb" ? colorScale.scale(d.operator) : "#F5F8FA"
    })
    .attr("stroke-width", 2)
    .attr("stroke", function (d) {
      return d.operator
    }, colorScale);

  var gridlines = new Plottable.Components.Gridlines(xScale, yScale);

  var northEast = new Plottable.Components.Label("North/Eastbound - Hollow")

  var southWest = new Plottable.Components.Label("South/Westbound - Filled")

  var chart = new Plottable.Components.Table([
    [null, null, null, null],
    [new Plottable.Components.Label("Minutes").angle(-90)
      .xAlignment("center"), yAxis, new Plottable.Components.Group([plot, gridlines]), legend],
    [null, null, xAxis, null],
    [null, null, new Plottable.Components.AxisLabel("Hours")
      .yAlignment("center"), null]
  ]);

  chart.renderTo("svg#duh");

  var adjustOpacity = function(plot, legendText) {
    plot.attr("opacity", function(d, i, ds) {
      return d.operator == legendText ? 1 : .1;
    });
  }
  var adjustByDirection = function(plot, direction1, direction2) {
    plot.attr("opacity", function(d, i, ds) {
      return d.direction == direction1  || d.direction == direction2 ? 1 : .1;
    });
  }

  new Plottable.Interactions.Click()
    .attachTo(northEast)
    .onClick(function(p) {
      if (legend.entitiesAt(p)[0] !== undefined) {
        adjustByDirection(plot, "nb", "eb");
      }
    });

  new Plottable.Interactions.Click()
    .attachTo(legend)
    .onClick(function(p) {
      if (legend.entitiesAt(p)[0] !== undefined) {
        var selected = legend.entitiesAt(p)[0].datum;
        adjustOpacity(plot, selected);
      }
    });

  new Plottable.Interactions.Click()
    .attachTo(plot)
    .onClick(function() {
      plot.attr("opacity", 1);
    });


  window.addEventListener("resize", function() {
    chart.redraw();
  });

});
