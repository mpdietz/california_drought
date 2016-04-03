    var popChart;
    var citiesChart;
    var sql = new cartodb.SQL({ user: 'mpd361' });
    var layerYr;

var mySlider = $('#ex1').slider({
  formatter: function(value) {
    return 'Year: ' + value;
  }
  });

    //create a new empty leaflet map over NYC
  var map = new L.Map('map', { 
      center: [35.1,-120],
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
      }).on('error', function(err) {
        console.log(err)
        //log the error
      var USDM_2016 = layer.getSubLayer(0);
        layer.getSubLayer(0).hide();
      var USDM_2015 = layer.getSubLayer(1);
        layer.getSubLayer(1).hide();
      var USDM_2014 = layer.getSubLayer(2);
        layer.getSubLayer(2).hide();
      var USDM_2013 = layer.getSubLayer(3);
        layer.getSubLayer(3).hide();
      var USDM_2012 = layer.getSubLayer(4);
        layer.getSubLayer(4).hide();
      var USDM_2011 = layer.getSubLayer(5);
        layer.getSubLayer(5).hide();
      var USDM_2010 = layer.getSubLayer(6);
        layer.getSubLayer(6).hide();

      });

mySlider.change(function(e) {
  console.log(e.value.newValue);
  var year = e.value.newValue.toString();
  var layerYr = 'USDM_' + year;
  console.log(layerYr);
  layer.hide(layerYr);
})

    //set up charts with nv.d3.js
    //population chart = count of points; each point = 1000 people
    nv.addGraph(function() {
      popChart = nv.models.multiBarHorizontalChart()

        .x(function(d) { return d.label })   
        .y(function(d) { return d.value })
        .margin({top: 0, right: 0, bottom: 0, left: 150})
        .showValues(true) 
        .valueFormat(function(d){
          return d;
        })
        .showControls(false)
        .showLegend(false)
        .height(250)
        .showYAxis(false)
        .barColor(function(d) { 
          return getColor(d.label)
        });
      ;

      popChart.tooltip.enabled(true);
      nv.utils.windowResize(popChart.update);

      return popChart;
    });

//cities chart = count of cities; cities are polygons. This might need ST Transform
    nv.addGraph(function() {
      citiesChart = nv.models.multiBarHorizontalChart()

        .x(function(d) { return d.label })   
        .y(function(d) { return d.value })
        .margin({top: 0, right: 0, bottom: 0, left: 150})
        .showValues(true) 
        .valueFormat(function(d){
          return d;
        })
        .showControls(false)
        .showLegend(false)
        .height(250)
        .showYAxis(false)
        .barColor(function(d) { 
          return getColor(d.label)
        });
      ;

      citiesChart.tooltip.enabled(false);
      nv.utils.windowResize(citiesChart.update);

      return citiesChart;
    });


    //fetches data to power the charts based on the current viewport* <--(this is very cool if i get it)
    function fetchData(bounds) {

      //count cities by dm
      sql.execute("SELECT dm, count(cartodb_id) FROM {{table}} WHERE the_geom && ST_MakeEnvelope({{bounds._southWest.lng}}, {{bounds._southWest.lat}}, {{bounds._northEast.lng}}, {{bounds._northEast.lat}}, 4326) GROUP BY dm ORDER BY count DESC;", { 
          table: layerYr,
          bounds: bounds
        })

        .done(function(data) {
          var citiesChartData = [{
            key: "Series 1",
            values: []
          }];

          data.rows.forEach( function(row) {
            citiesChartData[0].values.push({
              label: row.cities,
              value: row.count
            })
          });

          callChart('citiesChart', citiesChartData);

        })
        .error(function(errors) {
          // errors contains a list of errors
          console.log("errors:" + errors);
        });

        //count population by dm
        sql.execute("SELECT DM, count(population) FROM {{table}} WHERE the_geom && ST_MakeEnvelope({{bounds._southWest.lng}}, {{bounds._southWest.lat}}, {{bounds._northEast.lng}}, {{bounds._northEast.lat}}, 4326) GROUP BY dm ORDER BY count DESC;", { 
          table: layerYr,
          bounds: bounds
        })
        .done(function(data) {
          var popChartData = [{
            key: "Series 1",
            values: []
          }];

          data.rows.forEach( function(row) {
            typeChartData[0].values.push({
              label: row.population,
              value: row.DM
            })
          });

          callChart('popChart',popChartData);
  
        });
    };

    //updates chart with new data
    function callChart(chart, data) {
      d3.select('#' + chart + ' svg')
        .datum(data)
        .transition().duration(750)
        .call(window[chart]);
    }

    //maps colors
    function getColor(DM) {
      switch(DM) {
        case '0':
            return '#FFFFB2'
            break;
        case '1':
            return '#FED976'
            break;
        case '2':
            return '#FD8D3C'
            break;
        case '3':
            return '#FC4E2A'
            break;
        case '4':
            return '#B10026'
            break;
        }
      }


