window.onload = function(){
	var mymap;
	init(mymap);
}

// function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
//     var R = 6378.137; // Radius of earth in KM
//     var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
//     var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var d = R * c;
//     return d * 1000; // meters
// }

var init =  function(mymap){
	mymap = L.map('mapid').setView([-8.0620287, -34.8987418], 13);

	mapLink = '<a href="https://carto.com/attribution">Carto</a>';
    L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(mymap);
    


    var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, transportation);

    var command = L.control({position: 'topright'});

	command.onAdd = function (map) {
    	var div = L.DomUtil.create('div', 'radiobox');

    	div.innerHTML =` 
    		<form action="" >
  			<input class="radio" type="radio" name="section" value="education" checked="checked">Education<br>
  			<input class="radio" type="radio" name="section" value="entertainment">Entertainment<br>
  			<input class="radio" type="radio" name="section" value="financial">Financial <br>
  			<input class="radio" type="radio" name="section" value="healthcare">Healthcare <br>
  			<input class="radio" type="radio" name="section" value="sustenance">Sustenance <br>
  			<input class="radio" type="radio" name="section" value="transportation">Transportation <br>
  			<input class="radio" type="radio" name="section" value="others">Others <br>
		</form>`; 
    	return div;
	};

	command.addTo(mymap);


	// add the event handler
	function handleCommand() {

		removeGrid(mymap);
		switch(this.value) {
    		case "education":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, education);
        		break;
    		case "entertainment":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, entertainment);
        		break;
        	case "financial":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, financial);
        		break;	
   			case "healthcare":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, healthcare);
        		break;
        	case "sustenance":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, sustenance);
        		break;
        	case "transportation":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, transportation);
        		break;
        	case "others":
        		var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, others);
        		break;
		}
	}

	
	var elements = document.getElementsByClassName("radio");
	for (var i = 0; i < elements.length; i++) {
  		elements[i].addEventListener("click", handleCommand);
	}


    /*
    for (var i = 0; i < grid.length; i++) {
    	for (var j = 0; j < grid[i].length; j++) {
    		//id, lat, long
    		console.log(grid[i][j]._leaflet_id + ": [" + grid[i][j].getCenter().lat + ", " + grid[i][j].getCenter().lng + "],")
    	}
    }

    debugger;
    */
}

var drawGrid = function(lat_min, long_min, lat_max, long_max, cells, mymap, section){

	var widthTotal =  Math.abs(lat_min - lat_max)
	var heightTotal = Math.abs(long_min - long_max)
	var eachWidth = widthTotal/cells
	var eachHeight = heightTotal/cells
	var grid = new Array();
	var cor = d3.scaleLinear()
		.range([0,1])
		.domain([d3.min(section, function(d){return d.hits}), d3.max(section, function(d){return d.hits})]);

		for(var row = 0; row < cells; row++){
			grid.push( new Array())

			for(var column = 0; column < cells; column++){


				var bounds = [
							 [lat_min + column * eachWidth, long_min + row * eachHeight], 
							 [lat_min + (column + 1) * eachWidth, long_min + (row + 1) * eachHeight]


							 										];
				var rect = L.rectangle(bounds, 
					{weight: 0, fillOpacity : 0.4})
					;
				rect.options.color = d3.interpolateBlues(cor(section[(row * 100) + column].hits))
				rect.options.className = "rect"
				if(transportation[(row * 100) + column].hits > 0){
					rect.addTo(mymap);
				} 
					
				grid[row].push(rect);
			}
				
		}	
	return grid	
}	


var removeGrid = function(mymap) {

	mymap.eachLayer(function (layer) {
		if(layer.options.className === "rect"){
			mymap.removeLayer(layer);	
		}
	});

}
