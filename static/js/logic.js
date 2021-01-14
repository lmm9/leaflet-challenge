// Define streetmap layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 15,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        37.09, -100
    ],
    zoom: 5,
  });
  
  streetmap.addTo(myMap);
  
  // Store our API endpoint inside queryUrl
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  d3.json(queryUrl, function(data) {
  
    /// We will create three function. 
    // function 1 for style, function 2 for color and function 3 for radiues
  
    function mapStyle(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: mapColor(feature.properties.mag),
        color: "#000000",
        radius: mapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
    function mapColor(mag) {
        switch (true) {
          case mag > 5:
            return "IndianRed";
          case mag > 4:
            return "Orange";
          case mag > 3:
            return "Yellow";
          case mag > 2:
            return "GreenYellow";
          case mag > 1:
            return "Lime";
          default:
            return "Cyan";
        }
      }
    
      function mapRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
      }
      
    
    
      L.geoJson(data, {
    
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
    
        style: mapStyle,
    
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    
        }
      }).addTo(myMap);
    
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['1','2','3','4','5'];

    for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i style="background:' + getColor(categories[i] + 1) + '"></i> ' +
                (categories[i] ? categories[i] : '+'));
        }

        div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
      
    });