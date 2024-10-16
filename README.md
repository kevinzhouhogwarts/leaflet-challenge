# Leaflet Earthquake Map

## Overview
This project uses Leaflet to plot the earthquakes of magnitude 4.5 or greater from the past month, based on geoJSON data from the U.S. Geological Survey.

## Method
First, select the geoJSON data endpoint from USGS: in this case, the data set for very recent earthquakes of relatively high magnitude.
Immediately after, request the geoJSON and pass the resolved data promise to a callback function using the .then() operation. Th components of this function will be fully fleshed out later.
Then, add the basic elements of the map by creating a map object, populating it with a tile layer and a legend.
To prepare for adding markers corresponding to each earthquake, define assisting functions that will be responsible for customizing the size and the color of those markers.
Finally, define the functions which will be used to create the earthquake markers and which will be called by the original callback function:
* Use L.geoJSON to create markers (changed from the default pin appearance to circular markers)
* Use the built-in onEachFeature function to bind a popup to each marker. If the use case called for hover-over behavior, then it would be added within this function. In this case, popup on click was sufficient so no additional behavior was added.
Finally, add the layer containing the earthquake marker to the map using a layer control element, so that it can be toggled on and off.

## Conclusion and Adjustment
One challenge of this dataset was the narrow range of earthquake magnitudes values available, specifically 4.5 and above. There are relatively few earthquakes of magnitude 5.0 and above, so most of the plotted earthquakes had magnitudes of 4.5 to 4.9. In an attempt to better distinguish between earthquakes of differing, but closely-clustered, magnitudes, an exponential operation was applied to the magnitude value. Other methods, such as normalizing the magnitude range to a scale between 0 and 1, or using a step-wise, explicit definition of magnitude transformation with the aid of an if-else statement, would have also been possibilities.

An observation is that most of these 4.5 magnitude or greater earthquakes are classified as shallow (depth of 70km or less). It would be interesting to see if a similar proportion of all earthquakes are also shallow earthquakes, using the relevant geoJSON dataset from USGS. This was performed by simply replacing the dataset URL and the exponential transform for the earthquake marker size held up well. It seems that most recorded earthquakes are indeed shallow ones, while deeper earthquakes are more common in a few regions, including the western Indo-Pacific, Alaska, and Central and South America.

After adding the second overlay layer using a second geoJSON request and callback function, the original layer control element appeared twice, since it was originally placed within the callback function. To rectify this, both the defintion of the overlay layer and the overall layer control were moved a single callback function, which was called with the help of promise.all() method, which takes an array of individual promises.
