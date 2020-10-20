// Perform API call to retrieve USGS earthquake data. Call createMarkers when complete.
var geoData = d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers)

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Create a legend to display map information
var legend = L.control({position: "bottomleft"});

 // When the layer control is added, insert a div with the class of "legend"
 legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];;
          
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
              labels[i] + '<br>' ;
    }
      return div;
  };
  
  // Add the info legend to the map
  legend.addTo(map);
}


 // Write function to create markers
  function createMarkers(response) {
  
  // Select the features property from response
  var features = response.features;
  // console.log(features)

  // Initialise an array to hold the magnitude and depth markers
  var earthquakeMarkers = [];

  // Loop through the features array
  for (var index = 0; index < features.length; index++) {
    var feature = features[index];
    var location = feature.geometry;
        
    // For each earthquake, create a marker and bind a popup with additional information
    var earthquakeMarker = L.circle([location.coordinates[1],location.coordinates[0]],{
      radius:(feature.properties.mag)*20000,
      fillColor: getColor(location.coordinates[2]),
      fillOpacity: 0.8,
      color: "black",
      stroke: true,
      weight: 0.5
    })
    .bindPopup("<h3>" + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3>" + "<h3>Depth: " + location.coordinates[2] + "</h3>");
  
    // Add the marker to the earthquakeMarkers array
    earthquakeMarkers.push(earthquakeMarker);
  }

  // Create a layer group made from the earthquakeMarkers array, pass it into the createMap function
  createMap(L.layerGroup(earthquakeMarkers));
  };

// Write function to determine the fill colour of circle marker, based on depth

function getColor(depth){
  if (depth > 90) {
    return "#FF3333";
  }
  else if (depth > 70) {
    return "#FF6633";
  }
  else if (depth > 50) {
    return "#FF9933";
  }
  else if (depth > 30) {
    return "#FFCC33";
  }
  else if (depth > 10) {
    return "#FFFF33";
  }
  else if ( depth > -10) {
    return "#9CFF33";
  }
  else {
    return "#000000";
  }
}

