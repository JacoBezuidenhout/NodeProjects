/////////////////////////map
var data = {}
var heatMapLayer = {};
var me = {};

function drawMap()
{
  // var data = new ol.source.Vector();

  var map = new ol.Map({
       target: 'map',
       layers: [
         new ol.layer.Tile({
             source: new ol.source.MapQuest({ layer: 'sat' })
         })
       ],
       view: new ol.View({
           center: ol.proj.transform([28.41, -24.82], 'EPSG:4326', 'EPSG:3857'),
           zoom: 4
       })
   });

  // create the layer
  // var heatMapLayer = new ol.layer.Heatmap({
  //      source: data,
  //      radius: 5
  //  });

  // add to the map

  function addPoint(coord,weight,id)
  {

    if (typeof data[id] == 'undefined')
    {
      data[id] = new ol.source.Vector();

      heatMapLayer[id] = new ol.layer.Heatmap({
           source: data[id],
           radius: 5
       });

      map.addLayer(heatMapLayer[id]);
      console.log(id);
      heatMapLayer[id].setVisible(false);
    }

    var lonLat = new ol.geom.Point(coord);

    var pointFeature = new ol.Feature({
        geometry: lonLat,
        weight: weight // e.g. dbi
    });
    //console.log(data[id]);
    data[id].addFeature(pointFeature);

  }

  function setLoc(coord)
  {
      me.data = new ol.source.Vector();

      if (typeof me.layer == 'undefined')
      {
        me.layer = new ol.layer.Vector({
             source: me.data
         });
        map.addLayer(me.layer);
      }
      else
      {
        map.removeLayer(me.layer);
        me.layer = new ol.layer.Vector({
             source: me.data
         });
        map.addLayer(me.layer);
      }

    var lonLat = new ol.geom.Point(coord);

    var pointFeature = new ol.Feature({
        geometry: lonLat
    });
    //console.log(data[id]);
    me.data.addFeature(pointFeature);


  }


  // $('#blur').change(function(event) {
  //     if (event.originalEvent) {
  //         console.log(event.originalEvent.srcElement.value);
  //         heatMapLayer.setBlur(parseInt(event.originalEvent.srcElement.value, 10));
  //     }
  //     else {
  //       //programmatic change
  //     }
  // });
  //
  // $('#radius').change(function(event) {
  //     if (event.originalEvent) {
  //         console.log(event.originalEvent.srcElement.value);
  //         heatMapLayer.setRadius(parseInt(event.originalEvent.srcElement.value, 10));
  //     }
  //     else {
  //       //programmatic change
  //     }
  // });

  $('#node_select').change(function(event) {
      if (event.originalEvent) {
          console.log(event.originalEvent.srcElement.value);
          console.log(heatMapLayer);
          setLayer(event.originalEvent.srcElement.value);
      }
      else {
        //programmatic change
      }
  });

  socket.on('gps', function (data) {

    addPoint(ol.proj.transform([data.x, data.y], 'EPSG:4326', 'EPSG:3857'),data.w, data.id);

  });

  socket.on('loc', function (data) {

    setLoc(ol.proj.transform([data.x, data.y], 'EPSG:4326', 'EPSG:3857'));

  });

}

function setLayer(id)
{
  jQuery.each(heatMapLayer, function(i, val) {
    val.setVisible(false);
  });

  heatMapLayer[id].setVisible(true);
}
