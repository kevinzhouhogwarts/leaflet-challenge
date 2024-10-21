// Set the earthquake data endpoint
const url_all = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
const url_strong = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

let overlayMaps = {};

/* Request the JSON data, then call the createFeatures function on the data.features object
once the request has been resolved
d3.json(url).then(function (data) {
  createFeatures(data.features);
})*/

/* Make two requests, obtain two data promises, then use Javascript's 'array destructuring' to
unpack the two promises and pass each individually to the callback function*/
Promise.all([
  d3.json(url_all),
  d3.json(url_strong)
]).then(function ([dataAll, dataStrong]) {
  overlayMaps["USGS All Earthquakes, Past Month"] = createFeatures(dataAll.features);
  overlayMaps["USGS Magnitude 4.5+ Earthquakes, Past Month"] = createFeatures(dataStrong.features);
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});

// Add a default tile layer
let globalMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
})
// Add a tile layer in topographical style
let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// Define variable to contain all tile layers
let baseMaps = {
'Default Map': globalMap,
'Topographical Map': topoMap
};

// Create the map object, name it myMap, and specify a default tile layer
let myMap = L.map("map", {
  center: [39.8283, -98.5795], // Center the map at the desired location
  zoom: 3, // Sets the initial zoom level
  layers: [globalMap] // 
});

// Create a legend
let info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <h3>Map Legend</h3>
      <a href="https://www.usgs.gov/programs/earthquake-hazards/determining-depth-earthquake" target="_blank">
        <h4>Earthquake Depth:</h4>
      </a>
    <p>
    <span class="legend-rectangle" style="background-color:red;"></span> Shallow - 0 to 70km<br>
    <span class="legend-rectangle" style="background-color:orange;"></span> Intermediate - 70 to 300km<br>
    <span class="legend-rectangle" style="background-color:yellow;"></span> Deep - 300 to 700km
    </p>
    `;
  return div;
};

info.addTo(myMap);

// Custom function to scale the marker size using the earthquake magnitude
function markerSize(data) {
  return Math.pow(data, 5) * 0.005;
}

// Custom function to select marker color using the earthquake depth
function markerColor(data) {
  let color = "";
    if (data < 70) {
      color = "red";
    }
    else if (data > 300) {
      color = "orange";
    }
    else {
      color = "yellow";
    }
  return color;
};

/* Function for creating markers for each earthquake, using L.geoJSON,
then applying a popup, using onEachFeature*/
function createFeatures(dataFeatures) {
  
  function onEachFeature(feature, layer) {

    // Create popup
    layer.bindPopup(
      `<a href="${feature.properties.url}" target="_blank">
        <h3>${feature.properties.place}</h3>
      </a>
      <p>Time: ${new Date(feature.properties.time)}<br>
      <a href="https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity">
        Magnitude: ${feature.properties.mag}
      </a><br>
      Depth: ${feature.geometry.coordinates[2]} km</p>`
    );
  };

  let earthquakesLayer = L.geoJSON(dataFeatures, {
    pointToLayer: function (feature) {
      return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: markerColor(feature.geometry.coordinates[2]),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag)
      });
    },
    onEachFeature: onEachFeature,
  });

  return earthquakesLayer;

  /* Define a variable to contain the overlay layer.
  In the updated code version with two overlay layers, defining the overlay layers was
  moved to directly within the callback function.
  let overlayMaps = {
    "USGS Magnitude 4.5+ Earthquakes, Past Month": earthquakesLayer
  };*/

  /* Pass all layers into layer control, add layer control to map.
  In the updated code version, this was also moved into the callback function.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);*/
};


