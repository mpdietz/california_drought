    var popChart;
    var citiesChart;
    var sql = new cartodb.SQL({ user: 'mpd361' });
    var layerYr;
    var layerOld;
    var usdm_2016;
    var usdm_2015;
    var usdm_2014;
    var usdm_2013;
    var usdm_2012;
    var usdm_2011;
    var usdm_2010;

  //set year slider
var mySlider = $('#ex1').slider({
  formatter: function(value) {
    return 'Year: ' + value;
  }
  });

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});
    //create a new empty leaflet map over California @ a statewide level
  var map = new L.Map('map', { 
      center: [35.1,-115],
      zoom: 5
    });

    //add dark basemap
  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

 var layerUrl = 'https://nyu.cartodb.com/u/mpd361/api/v2/viz/275b6fe0-ebbe-11e5-8d06-0e31c9be1b51/viz.json';

    //leaflet hash plugin updates the URL with the current map center and zoom level
  var hash = new L.Hash(map);

cartodb.createLayer(map, layerUrl)
      .addTo(map)
      .on('done', function(layer) {
        console.log(layer);
      usdm_2016 = layer.getSubLayer(0);
        usdm_2016.hide();
      usdm_2015 = layer.getSubLayer(1);
        usdm_2015.hide();
      usdm_2014 = layer.getSubLayer(2);
        usdm_2014.show();
      usdm_2013 = layer.getSubLayer(3);
        usdm_2013.hide();
      usdm_2012 = layer.getSubLayer(4);
        usdm_2012.hide();
      usdm_2011 = layer.getSubLayer(5);
        usdm_2011.hide();
      usdm_2010 = layer.getSubLayer(6);
        usdm_2010.hide();
      })
      //log the error
      .on('error', function(err) {
        console.log(err)
        })

mySlider.change(function(e) {
  console.log(e.value.newValue);
  var year = e.value.newValue.toString();
  var old = e.value.oldValue.toString()
  var layerYr = 'usdm_' + year;
  var layerOld = 'usdm_' + old;
  console.log(layerYr);
 window[layerOld].hide();
 window[layerYr].show();
})

    //set up charts with nv.d3.js
    //population chart = count of points; each point = 1000 people,  real population is distorted by dot density
    //sum population by dm is in the field population_k for all year layers (USDM_2010 to USDM_2016)

// This does not currently work. I am calling on the tables incorrectly and something is wrong with the sql:

     //     sql.execute("SELECT dm as label, sum(population_k) as value FROM {{window[layerYr]}} GROUP BY dm ORDER BY value DESC").done(function(data) {
     //        console.log(data.rows)
     //        var ChartData = [
     //          {
     //            key: "Population",
     //            values: data.rows
     //          },
     //        ];
          
     //        nv.addGraph(function() {
     //          var chart = nv.models.stackedAreaChart()
     //                        .margin({right: 100})
     //                        .x(function(d) { return d.label })    //Specify the data accessors.
     //                        .y(function(d) { return d.value })  
     //                        .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
     //                        .transitionDuration(500)
     //                        .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
              
     //          chart.xAxis
     //              .tickFormat(function(d) { 
     //                console.log(d);
     //          });

     //          console.log(ChartData);
     //          chart.yAxis
     //              .tickFormat(d3.format(',.f'));

     //          d3.select('#chart svg')
     //            .datum(ChartData)
     //            .call(chart);
     //                nv.utils.windowResize(chart.update);
     //          return chart;
     //        });
     // })



