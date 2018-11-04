import * as d3 from "d3";

import { countryColor, chartCountries, context } from './constants';
import { showTipCountry, hideTipCountry }  from './countriesSteps';

function drawMap(svg,data,path,colorFill) {

	//console.log("Map Utils - Draw Map");
	//console.log("Map Utils - Draw Map - svg",svg);
	//console.log("Map Utils - Draw Map - data",data);

	// at first, disable the hover on countries for people to focus on the story
	svg.classed("pointer-disabled", true);

	let mapSvg = svg.append("g")
		.attr("class","mapGroup")

	mapSvg.selectAll("path")
			.data(data)
			.enter()
				.append("path")
				.attr("class", "mapItem")
				.attr("d", path)
				.attr("stroke","white")
				.attr('stroke-width', '0.5')
				.attr("fill", colorFill)
				.on("mouseover", (d,i) => {

					d3.select(d3.event.target)
						.style("stroke-width",3);

					showTipCountry(d);
				})
				.on("mouseout", (d,i) => {
					d3.select(d3.event.target)
						.style("stroke-width",0.5);

					hideTipCountry();
				});

	//console.log("Map Utils - Draw Map - end");
}

function drawMapCanva(path,features){

	//console.log("MapUtils - drawMapCanva");

	//console.log("drawMapCanva - before geoGenerator");
	let geoGenerator = path.context(context);

	//console.log("Map Utils - drawMapCanva - features",features);

	context.beginPath();
	//geoGenerator({type: 'FeatureCollection', features: features})
	context.fillStyle = countryColor;
	context.lineWidth = '0.5';
  context.strokeStyle = 'white';

	geoGenerator({type: 'FeatureCollection', features: features});
	context.fill();
	context.stroke();

	//console.log("drawMapCanva -end");
}

function getLargetPolygon(coordinatesArray){
	let currentLen, maxLen, index ;

	coordinatesArray.forEach( (d,i) => {
		currentLen = d[0].length;
		if (i == 0){
			index = i;
			maxLen = currentLen;
		}
		else {

			if (currentLen > maxLen){
				maxLen = currentLen;
				index = i;
			}
		}
	});

	return index;
}

// compute center of a country and add it to the object
function addVisitedCountriesCenter(proj,countriesData,visitedCountries){
	//console.log("Map Utils - addVisitedCountriesCenter");

	let country;

	const visitedCountriesName = visitedCountries.map((d) => { return d.name});
	const visitedData = countriesData.filter((d) => { return (d.geometry != null) && (visitedCountriesName.includes(d.properties.ADMIN)) });
	//console.log("visitedCountriesName",visitedCountriesName);
	//console.log("visitedData",visitedData);

	visitedCountries.forEach((v) => {
		country = visitedData.find((d) => d.properties.ADMIN == v.name);

		//console.log("Map Utils - addVisitedCountriesCenter - v loop",v);
		//console.log("Map Utils - addVisitedCountriesCenter - country",country);

		if (country !== undefined) {
			//console.log("Map Utils - addVisitedCountriesCenter - before if");
			v.center = computeCenterFromPloygon(proj,country.geometry.coordinates);
			//console.log("Map Utils - addVisitedCountriesCenter - after if");
		}

	});

	//console.log("Map Utils - addVisitedCountriesCenter - visitedCountries",visitedCountries);
}

// computer center of a country in pixel from a country polygon coordinates array
function computeCenterFromPloygon(proj,polygon){
	//console.log("Map Utils - computeCenterFromPloygon");

	let center, polygonLength ;
	//console.log(polygon.length);
	// if countrie contains several polygon, look for the most "detailed" (the largest array), it's likely to be the main Polygon countries

	polygonLength = polygon.length;
	if (polygonLength > 1) {
		center = proj(d3.polygonCentroid(polygon[getLargetPolygon(polygon)][0]));
	}
	else{
		center =  proj(d3.polygonCentroid(polygon[0]));
	}

	//console.log("Map Utils - computeCenterFromPloygon - center", center);
	return center;
}



export { drawMap, addVisitedCountriesCenter, drawMapCanva };
//export default { drawMap, getLargetPolygon, computeCenterFromPloygon, addVisitedCountriesCenter, colorCountries, drawCountriesCenter, drawLine };
