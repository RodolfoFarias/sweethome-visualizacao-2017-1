window.onload = function(){
	init();
}



var init =  function(){
	var mymap = L.map('mapid').setView([-8.0620287, -34.8987418], 13);

	mapLink = '<a href="https://carto.com/attribution">Carto</a>';
    L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(mymap);

    
    d3.json("RecifeTransportation.geojson", function(data){
    	coordinates = [];
    	for (i = 0; i < data.features.length ; i++) {
    		tempCoor = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]
    		coordinates.push(tempCoor)
    	}

    	var heat = L.heatLayer(coordinates, {radius: 25}).addTo(mymap);  // lat, lng, intensity
	
    })
    
}