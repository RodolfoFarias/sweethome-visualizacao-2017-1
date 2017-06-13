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

	createGraph(mymap);

	createSlider(mymap, grid);
	
	createLegend(mymap, color);


	//createGraph(mymap);
	
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

	//set off the dragging
	slider.getContainer().addEventListener('mouseover', function () {
        map.dragging.disable();
    });

	//set on again
    slider.getContainer().addEventListener('mouseout', function () {
        map.dragging.enable();
    });

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

var createGraph = function(map){

	var graph = L.control({position: 'bottomleft'});

	graph.onAdd = function(map) {
		var div = L.DomUtil.create('div', 'graph');

	    	div.innerHTML ='<div id="myDiv">'; 

	    	return div;
    }
	graph.addTo(map);
	
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
    	width = 800 - margin.left - margin.right,
    	height = 200 - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    y = {},
    dragging = {};


	var line = d3.line(),
    	//axis = d3.axisLeft(x),
    	background,
    	foreground,
    	extents;

	var svg = d3.select(".graph").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.on("mouseover", function () {map.dragging.disable();})
        .on("mouseout", function () {map.dragging.enable();});




	d3.csv("some.csv", function(error, data) {



	    //make markers on map
		createMarkers2(map, data)	    
	    
	  // Extract the list of dimensions and create a scale for each.
	    //data[0] contains the header elements, then for all elements in the header
	    //different than "name" it creates and y axis in a dictionary by variable name
	  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
	  	
	    if(	d == "Titulo" || 
	    	d == "Rua" || 
	    	d == "Bairro" || 
	    	d == "CEP" || 
	    	d == "Latitude" || 
	    	d == "Longitude" || 
	    	d == "Tipo Vendedor" || 
	    	d == "Data Coleta" ||
	    	d === "Area Total (m2)" ||
	    	d == "Taxa Condomínio" ||
		d == "LatLng" ||
		d == "Others" ||
	    	d == "Tipo") {
	        return false;
	    }
	      
	    return y[d] = d3.scaleLinear()
	        .domain(d3.extent(data, function(p) { 
	            return +p[d]; }))
	          .range([height, 0]);	      
	  }));

	    	      

	  extents = dimensions.map(function(p) { return [0,0]; });

	  // Add grey background lines for context.
	  background = svg.append("g")
	      .attr("class", "background")
	    .selectAll("path")
	      .data(data)
	    .enter().append("path")
	      .attr("d", path);

	  // Add blue foreground lines for focus.
	  foreground = svg.append("g")
	      .attr("class", "foreground")
	    .selectAll("path")
	      .data(data)
	    .enter().append("path")
	      .attr("d", path);

	  // Add a group element for each dimension.
	  var g = svg.selectAll(".dimension")
	      .data(dimensions)
	    .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) {  return "translate(" + x(d) + ")"; })
	      .call(d3.drag()
	        .subject(function(d) { return {x: x(d)}; })
	        );
	  // Add an axis and title.
	  g.append("g")
	      .attr("class", "axis")
	      .each(function(d) {  d3.select(this).call(d3.axisLeft(y[d]));})
	      //text does not show up because previous line breaks somehow
	    .append("text")
	      .style("text-anchor", "middle")
	      .attr("y", -9) 
	      .text(function(d) { return d; });

	  // Add and store a brush for each axis.
	  g.append("g")
	      .attr("class", "brush")
	      .each(function(d) {
	        d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8,height]]).on("brush start", brush_parallel_chart).on("brush", brush_parallel_chart));
	      })
	    .selectAll("rect")
	      .attr("x", -8)
	      .attr("width", 16);
	});

	function position(d) {
	  var v = dragging[d];
	  return v == null ? x(d) : v;
	}

	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}
	 
	// Handles a brush event, toggling the display of foreground lines.
	function brush_parallel_chart() {
	    d3.event.sourceEvent.stopPropagation();
	    for(var i=0;i<dimensions.length;++i){
	        if(d3.event.target==y[dimensions[i]].brush) {
	            extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
	        }
	    }
	      foreground.style("display", function(d) {
	      	
	        return dimensions.every(function(p, i) {
	        	
	            if(extents[i][0]==extents[i][1]) {
	                return true;
	            }
	          return extents[i][1] <= d[p] && d[p] <= extents[i][0];
	        }) ? null : "none";
	      });
	}

}

var createMarkers = function(map, data){

	var markers = new L.FeatureGroup();


	data.forEach(function(d) {
		var m = new L.Marker([d["Latitude"], d["Longitude"]]);
		markers.addLayer(m);

	});

    map.addLayer(markers);
}


var createMarkers2 = function(map, data) {   

	//var svgLayer = L.svg();
	//svgLayer.addTo(map);
	/* We simply pick up the SVG from the map object */
	var svg = d3.select(map.getPanes().overlayPane).select("svg"),
	g = svg.append("g");

	data.forEach(function(d) {
		d.LatLng = new L.LatLng(d["Latitude"],d["Longitude"])
	})


	var feature = g.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", .6) 
			.style("fill", "red")
			.attr("r", 10)
			.attr("class", "leaflet-zoom-hide"); 

	
    map.on("viewreset", update);
    map.on("moveend", update);
		update();

		function update() {
			feature.attr("transform", 
			function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
		}
}
