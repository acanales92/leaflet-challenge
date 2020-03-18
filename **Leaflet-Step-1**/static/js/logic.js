var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


d3.json(queryUrl, function(data) {

  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place +
      "</h3><hr><p>Date & Time: " + new Date(feature.properties.time) + "</p>");
  }

  function radiusSize(magnitude) {
    return magnitude * 10000;
  }


  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#ccff33"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#ffcc33"
    }
    else if (magnitude < 4) {
      return "#ff9933"
    }
    else if (magnitude < 5) {
      return "#ff6633"
    }
    else {
      return "#ff3333"
    }
  }


  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1

      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

//gray map scale
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  // hold our base layers
  var baseMaps = {
    "Greyscale Map": grayscalemap
  };


  // Tiying up Layers
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [grayscalemap, earthquakes]
  });
 
  // creating the legend


var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend');
      var magnitude = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var colorScheme = ["#ccff33", "#ffff33", "#ffcc33", "#ff9933", "#ff6633", "#ff3333"];
        
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
          '<p style="margin-left: 15px">' + '<i style="background:' + colorScheme[i] + ' "></i>' + '&nbsp;&nbsp;' + magnitude[i]+ '<\p>';
        }
  
      return div;
  };
  
  legend.addTo(myMap);
}


