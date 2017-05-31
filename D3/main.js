window.onload = function(){
	var mymap;
	init(mymap);
}

var myOpacity = 0.4;

var init =  function(mymap){

	mymap = L.map('mapid').setView([-8.0620287, -34.8987418], 13);

	mapLink = '<a href="https://carto.com/attribution">Carto</a>';
    L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(mymap);
    


    var grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, transportation);

    // radiobox begin
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
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, education);
        		break;
    		case "entertainment":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, entertainment);
        		break;
        	case "financial":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, financial);
        		break;	
   			case "healthcare":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, healthcare);
        		break;
        	case "sustenance":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, sustenance);
        		break;
        	case "transportation":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, transportation);
        		break;
        	case "others":
        		grid = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, others);
        		break;
		}
	}

	
	var elements = document.getElementsByClassName("radio");
	for (var i = 0; i < elements.length; i++) {
  		elements[i].addEventListener("click", handleCommand);
	}

	//radiobox end

	var slider = L.control({position: 'topright'});

	slider.onAdd = function (map) {
    	var div = L.DomUtil.create('div', 'slider');

    	div.innerHTML ='<input type="range" id="myRange" value="40">'; 
    	return div;
	};

	slider.addTo(mymap);

	var refSlider = document.getElementById('myRange');
	
	refSlider.addEventListener("click", function(event){
    	event.preventDefault()
	});

	refSlider.onchange = function(){
		setOpacity(grid, this.value/100)
	}
	debugger


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
					{weight: 0, fillOpacity : myOpacity})
					;
				rect.options.color = d3.interpolateBlues(cor(section[(row * 100) + column].hits))
				rect.options.className = "rect"
				if(transportation[(row * 100) + column].hits > 0){
					rect.addTo(mymap);
					grid[row].push(rect);
				} 
					
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

var setOpacity = function(grid, _opacity) {
	myOpacity = _opacity;
	grid.forEach(function(a) {
		a.forEach(function(e) {
			e.setStyle({fillOpacity : _opacity})

    	})
	})
}

