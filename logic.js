// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);



function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

  // Create a baseMaps object.
 var baseMaps = {
   "Street Map": street
   //"Topographic Map": topo
  };
  
  let tectonicplates = new L.LayerGroup()
  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes,
    'Tectonic Plates': tectonicplates
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Legend
  let legend = L.control({position: 'bottomright'});
  // console.log(geojson.options.limits);
  // console.log(geojson.options.colors);
  legend.onAdd = function (myMap) {

     // let div = L.DomUtil.create('div', 'info legend'),
         //grades = geojson.options.limits.map( m => Math.round(m)),
       // grades = [0, 2.5, 5, 7 ],
        //colors = ['green', 'yellow', 'red', 'black'];

      // loop through our density intervals and generate a label with a colored square for each interval
      //for (let i = 0; i < grades.length; i++) {
        //L.circle(grades[i].length)
        //div.innerHTML +=
          //'<i style="background:' + colors[i] + '"></i> ' +
          //grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     // }

     // return div;
    function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#EA2C2C";
      case depth > 70:
        return "#EA822C";
      case depth > 50:
        return "#EE9C00";
      case depth > 30:
        return "#EECC00";
      case depth > 10:
        return "#D4EE00";
      default:
        return "#98EE00";
    }
  }
  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
    // We add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakes);
  // Then we add the earthquake layer to our map.
  earthquakes.addTo(map); 
      
  };

  legend.addTo(myMap);


}
});

