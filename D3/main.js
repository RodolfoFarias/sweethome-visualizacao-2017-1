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
    


    var grid = drawGrid(-8.0620287, -34.8987418, 53.902257, 27.561640, 100, mymap);

    debugger;
}

var drawGrid = function(lat_min, long_min, lat_max, long_max, cells, mymap){

	var widthTotal =  Math.abs(lat_min - lat_max)
	var heightTotal = Math.abs(long_min - long_max)
	var eachWidth = widthTotal/cells
	var eachHeight = heightTotal/cells
	var grid = new Array();

		for(var row = 0; row < cells; row++){
			grid.push( new Array())

			for(var column = 0; column < cells; column++){

				var bounds = [
							 [lat_min + column * eachWidth, long_min + row * eachHeight], 
							 [lat_min + (column + 1) * eachWidth, long_min + (row + 1) * eachHeight]
							 										];
				var rect = L.rectangle(bounds, 
					{color: d3.rgb(d3.randomUniform(255)(),d3.randomUniform(255)(),d3.randomUniform(255)()), weight: 0}).
					on('click', function (e) {

   					console.info(e);
				}).addTo(mymap);
			}
				grid[row].push(rect);
		}	
	return grid	
}	
