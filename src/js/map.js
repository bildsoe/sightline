
var NIRAS = (function(){
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

  var map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
      center: [1138682.4103642707, 7589356.1014068650],
      zoom: 11
    })
  });

  var lastFeature;
  var removeLastFeature = function () {
    if (lastFeature) source.removeFeature(lastFeature);
  };

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
      //Load API
      
      $.post( "http://localhost:3000/api/sightline", { name: "John", time: "2pm" })
        .done(function( data ) {
          console.log(data);
        })
        .fail(function (err) {
          console.log("failed");
          console.log(err);
        });
      
    });




  };
 
  initButtons();


  return {
   "map": map
  } 
  
})();
