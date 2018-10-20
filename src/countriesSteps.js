import * as d3 from "d3";
import { chartCountries, standardDuration, drawLineDelay, colorCountriesPause, colorCenterPause, dotVisitedColor, centerX, centerY, forceDuration } from './constants';
import { addNodeArrayToSim } from './forceUtils';

function drawLineSteps(chartCountries, visitedCountries, countriesStep, stepIndex){
	// There is a start of dot at the begining of the step, why ?
	let centerCountriesVisited = countriesStep.map((d)=>{return d.center});

	// Get the last country of the precedent step, to put it at the begining of the arrayCoordinates
	if (stepIndex != 0){
		const lastCountryCoordinates = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex - 1;}).slice(-1)[0].center;
		//console.log(lastCountryCoordinates);
		centerCountriesVisited.unshift(lastCountryCoordinates);
	}

	if (centerCountriesVisited.length >= 2){
		centerCountriesVisited.forEach((d,i) => {
			if(i <= centerCountriesVisited.length - 2){
				// draw a line between 2 points, given an array of coordinates @ mapsUtils.js
				//console.log(centerCountriesVisited.slice(i,i+2));
				drawLine(chartCountries.chartSel,centerCountriesVisited.slice(i,i+2),i);
			}
		})
	}
}

// Change the color of each countries with a transition and a delay
// delay is i +1 to let draw the line btw the last country of the precedent step, and the 1st country of the current step
function colorCountries(svg,countriesNamesToDraw,countryHighlightColor){

	//console.log("countriesStep - colorCountries");

	svg.selectAll(".mapItem")
		.filter( (d) => {
			return countriesNamesToDraw.includes(d.properties.ADMIN)
		})
		.transition()
			.delay( (d,i) => {
				//console.log("countriesStep - colorCountries - transition delay", (i+1)*(standardDuration + colorCountriesPause));
				return (i+1)*(standardDuration + colorCountriesPause) ;
			})
			.duration(standardDuration)
			.attr("fill", (d,i) => {
				//console.log("colorCountries - drawing : ", d);
				//console.log("colorCountries - countryHighlightColor : ", countryHighlightColor);
				return countryHighlightColor;
			});

	//console.log("countriesStep - colorCountries - end");
}

// draw a dot for each coordinates
// delay is i +1 to let draw the line btw the last country of the precedent step, and the 1st country of the current step
function drawCountriesCenter(svg,dataCenterCoordinates,fillColor, fillColorContour){
	//console.log("drawCountriesCenter - dataCenterCoordinates",dataCenterCoordinates)
	svg.selectAll(".dotVisited")
		.data(dataCenterCoordinates)
		.enter()
			.append("circle")
			.attr("class","dotVisitedContour")
			.attr("class",(d) => {
				//console.log("drawCountriesCenter - drawing : ", d.name);
				return "c"+d.name; } )
			.attr("cx", (d) => { return d.center[0] ; })
			.attr("cy", (d) => { return d.center[1] ; })
			.attr("r", 0)
			.attr("fill", fillColorContour)
			.transition()
				.delay( (d,i) => { return (i+1)*(standardDuration + colorCenterPause) ; })
				.duration(standardDuration*1.5)
				.attr("r", 5);

	svg.selectAll(".dotVisited")
		.data(dataCenterCoordinates)
		.enter()
			.append("circle")
			.attr("class","dotVisited")
			.attr("class",(d) => {
				//console.log("drawCountriesCenter - drawing : ", d.name);
				return "c"+d.name; } )
			.attr("cx", (d) => { return d.center[0] ; })
			.attr("cy", (d) => { return d.center[1] ; })
			.attr("r", 0)
			.attr("fill", fillColor)
			.transition()
				.delay( (d,i) => { return (i+1)*(standardDuration + 200) ; })
				.duration(standardDuration)
				.attr("r", 3.5);
}

// draw a line between 2 points, given an array of coordinates
function drawLine(svg,arrayCoordinates,idelay){

	//console.log("countriesSteps - drawLine - arrayCoordinates",arrayCoordinates);
	//console.log("countriesSteps - drawLine - svg",svg);

	const x1 = arrayCoordinates[0][0];
	const y1 = arrayCoordinates[0][1];
	const x2 = arrayCoordinates[1][0];
	const y2 = arrayCoordinates[1][1];

	svg
		.append('line')
		.attr("x1", x1)
		.attr("y1", y1)
		.attr("x2", x1)
		.attr("y2", y1)
		.attr("stroke", "#80ceff")
		.attr("stroke-width", 3)
		.attr("stroke-linecap", "round")
		.attr("stroke-dasharray", "5,5")
		//.attrs({ x1: x1, y1: y1, x2: x1, y2: y1})
		//.st({stroke: "#80ceff", strokeWidth: 3, strokeLinecap: "round", strokeDasharray:"5,5"})
		.transition()
			.delay(drawLineDelay*idelay)
			// Variabilize depending on line length ?  d^2 = (x2-x1)^2 + (y2-y1)^2
			.duration(2*standardDuration)
			.attr("x2", x2)
			.attr("y2", y2)
			/*
			.attrs({
				x2: x2,
				y2: y2
			})
			*/
}

function highlightCountriesStep(chartCountries, visitedCountries, stepIndex, countryHighlightColor, forceData){

		console.log("countriesStep - highlightCountriesStep - step : ",stepIndex);
		//console.log("visitedCountries",visitedCountries);
		const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});
		//console.log("countriesStep length of step " + stepIndex + "  : " + countriesStep.length);

		//filter before (not already drawn as countries)
		const countriesNamesToDraw = countriesStep.map((d)=>{return d.name});
		//console.log("countriesNamesToDraw",countriesNamesToDraw);

		// Change the color of each countries with a transition and a delay @ mapsUtils.js
		colorCountries(chartCountries.chartSel, countriesNamesToDraw, countryHighlightColor);

		drawLineSteps(chartCountries, visitedCountries, countriesStep,stepIndex);

		//console.log("countriesStep",countriesStep);
		// draw a dot for each coordinates @ mapsUtils.js
		drawCountriesCenter(chartCountries.chartSel, countriesStep, dotVisitedColor, countryHighlightColor);

		// do not show nodes for first step
		/*
		if (stepIndex != 0){
				addNodesStep(simulation, chartCountries, countriesStep, stepIndex, forceData);
		}
		*/

}

function addNodesStep(simulation, chartCountries, countriesStep, stepIndex, forceData){

	let nodesArray = [];
	let j;

	let xScaleCountry = d3.scaleLinear()
			.range([120,chartCountries.svgProps.width-80])
			.domain([1,18]);

	// build array of countries containing array of generated nodes
	// setup the initial position of nodes with x and y to the coordinates of the country
	// setup the desitnation position of nodes with centerX and centerY as clusters by country
	countriesStep.forEach((d,i) => {
		//console.log("addNodesStep - d: ",d.name);
		nodesArray[i] = new Array() ;
		for (j=0; j< d.people; j++) {
			nodesArray[i].push({
				id: d.id + "-" + j.toString(),
				x: d.center[0],
				y: d.center[1],
				centerX: xScaleCountry(d.id),
				centerY: centerY
				//centerX: centerX,
				//centerY: centerY
			});
		};
	})

	//console.log(nodesArray);
	let offset = 0;
	const delay = forceDuration;
	nodesArray.forEach((d) => {
		setTimeout(function() {
	    addNodeArrayToSim(simulation, d, forceData, chartCountries.chartSel);
		}, delay + offset)
		offset += delay;
	});
}

export { drawLineSteps, highlightCountriesStep, addNodesStep};
