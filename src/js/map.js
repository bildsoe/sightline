
var NIRAS = (function(){
  proj4.defs("EPSG:25832","+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
  
  var raster = new ol.layer.Tile({
    source: new ol.source.OSM({layer: 'sat'})
  });
  
  var source = new ol.source.Vector();

  var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  
  var format = new ol.format.WKT();

  var map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
      center: [1138682.4103642707, 7589356.1014068650],
      zoom: 13
    })
  });

  var lastFeature;
  

  var draw = new ol.interaction.Draw({
    source: source,
    type: 'LineString'
  });

  draw.on('drawend',  function(e) {
    lastFeature = e.feature;
  })
      
  draw.on('drawstart', function (e) {
    source.clear();
  });

  var initButtons = function () {
    $('.draw').on('click', function () {
      source.clear();
      map.removeInteraction(draw);
      map.addInteraction(draw);
    });

    $('.reset').on('click', function () {
      source.clear();
      map.removeInteraction(draw);
    });
    
    $('.load').on('click', function () {
      map.removeInteraction(draw);
      createProfile();
    });
    $('.startRoute').on('click', function () {
      source.clear();
      map.removeInteraction(draw);
      map.addInteraction(draw);
    });

    $('.resetRoute').on('click', function () {
      source.clear();
      map.removeInteraction(draw);
    });
    
    $('.getRoute').on('click', function () {
      map.removeInteraction(draw);
      getRoute();
    });

  }

  var getRoute = function () {
      map.removeInteraction(draw);
      //Load API

      console.log(lastFeature);
      
      var modifiedFeature = lastFeature.clone();

      modifiedFeature.getGeometry().transform('EPSG:3857', 'EPSG:25832');

      console.log(modifiedFeature.getGeometry().getLength());

      var wkt = format.writeFeature(modifiedFeature);

      $.post( "http://localhost:3000/api/getRoute", { data: wkt })
        .done(function( data ) {
            console.log(data);

            //TODO implement functionality for displaying returned route - refactor getRoute to 
            //use the last returned node ID to ensure continuation of path. When adding a point
            //this function should find the next section using routing, and add it to layer. 
            //Create different ol.interactions for the functions. 
        })
        .fail(function( err ){console.log(err)});

  };

  var createProfile = function () {
      map.removeInteraction(draw);
      //Load API

      console.log(lastFeature);
      
      var modifiedFeature = lastFeature.clone();

      modifiedFeature.getGeometry().transform('EPSG:3857', 'EPSG:25832');

      console.log(modifiedFeature.getGeometry().getLength());

      var wkt = format.writeFeature(modifiedFeature);

      $.post( "http://localhost:3000/api/sightline", { data: wkt })
        .done(function( data ) {
          //console.log(data);

          var mySeries = [];
          for (var i = 0; i < data.length; i++) {
              mySeries.push({"y":data[i].val,"ptx":data[i].ptx,"pty":data[i].pty});
          }
            
          var sourceClosestPoint = new ol.source.Vector();

          var vectorPt = new ol.layer.Vector({
            source: sourceClosestPoint,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                  
                })
              })
            })
          });
          
          map.addLayer(vectorPt);
            
          $('#container').highcharts({
            chart: {},
            title: {text: "Profil over Århus"},
            plotOptions: {
              series: {
                cursor: 'pointer',
                point: {
                  events: {
                    mouseOver: function () {
                     
                      var pt = new ol.geom.Point([this.ptx, this.pty]);
                      pt.transform('EPSG:25832', 'EPSG:3857');
                      
                      var featurething = new ol.Feature({
                        name: "Point",
                        geometry: pt
                      });
                      
                      sourceClosestPoint.clear();
                      sourceClosestPoint.addFeature( featurething );
                      
                    }
                  }
                }
              }
            },
            series: [{
              data: mySeries
            }]
          });
        })
        .fail(function (err) {
          console.log("failed");
          console.log(err);
        });
      
  };
 
  initButtons();

  return {
   "map": map
  } 
  
})();
