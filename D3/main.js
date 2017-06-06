window.onload = function(){
	var mymap;
	init(mymap);
}

var myOpacity = 0.4;
var grid = new Array();
var color

var init =  function(mymap){

	mymap = L.map('mapid').setView([-8.0620287, -34.8987418], 13);

	mapLink = '<a href="https://carto.com/attribution">Carto</a>';
    L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(mymap);
    

    [grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, education);
	
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
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, education);
				updateLegend(mymap, color);
        		break;
    		case "entertainment":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, entertainment);
				updateLegend(mymap, color);
        		break;
        	case "financial":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, financial);
				updateLegend(mymap, color);        		
        		break;	
   			case "healthcare":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, healthcare);
				updateLegend(mymap, color);
        		break;
        	case "sustenance":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, sustenance);
				updateLegend(mymap, color);
        		break;
        	case "transportation":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, transportation);
				updateLegend(mymap, color);
        		break;
        	case "others":
        		[grid, color] = drawGrid(-8.115846, -34.998665, -7.951308, -34.774132, 100, mymap, others);
				updateLegend(mymap, color);
        		break;
		}
	}

	
	var elements = document.getElementsByClassName("radio");
	for (var i = 0; i < elements.length; i++) {
  		elements[i].addEventListener("click", handleCommand);
	}

	//radiobox end

	createSlider(mymap, grid);
	
	createLegend(mymap, color);

	createGraph();
	
	//debugger;

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
	var cor = d3.scaleLinear()
		.range([0,1])
		.domain([0, d3.max(section, function(d){return d.hits})]);

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
	return [grid, cor]	
}	

var removeGrid = function(mymap) {

	mymap.eachLayer(function (layer) {
		if(layer.options.className === "rect"){
			layer.remove();	
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

var createLegend = function(map, color){
	var legend = L.control({position: 'bottomright'});
	var temp = color.domain()[1] - color.domain()[0]
		temp = temp/5
	legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, temp, temp * 2, temp * 3, temp * 4, temp * 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + 	d3.interpolateBlues(color(grades[i] + 1)) + '"></i> <text class = legendText>' + grades[i].toFixed(2) + '</text><br>' ;

    }
    return div;
	};

	legend.addTo(map);

}

var createSlider = function(map, grid){
	var slider = L.control({position: 'topright'});

	slider.onAdd = function (map) {
    	var div = L.DomUtil.create('div', 'slider');

    	div.innerHTML ='<input type="range" id="myRange" value="40">'; 
    	return div;
	};

	slider.addTo(map);

	var refSlider = document.getElementById('myRange');

	refSlider.onchange = function(){
		setOpacity(grid, this.value/100)
	}
}

var updateLegend = function(map, color){
	var temp = color.domain()[1] - color.domain()[0]
		temp = temp/5
	var grades = [0, temp, temp * 2, temp * 3, temp * 4, temp * 5];

	for (var i = 0; i < grades.length; i++) {
        d3.selectAll(".legendText").nodes()[i].innerHTML = grades[i].toFixed(2)
    }
}

var createGraph = function(){

}