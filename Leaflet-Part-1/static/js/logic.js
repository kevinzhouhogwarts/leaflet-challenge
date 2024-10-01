const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);




d3.json(url).then(function(data) {
    console.log(data);
  });
  
let myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Returns a value calculated from the earthquake magnitude. To be used as the marker size.
function markerSize(population) {
  return Math.sqrt(population) * 50;
}

