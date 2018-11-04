import * as d3 from "d3";
import { chartCountries, visitedCountries, context, lineColor, standardDuration, drawLineDelay, colorCountriesPause, colorCenterPause, countryColor, dotVisitedColor, centerX, centerY, forceDuration, tooltipCountries } from './constants';
import { addNodeArrayToSim, addNodeArrayToSimCanvas, deleteNodes } from './forceUtils';



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
				drawLine(chartCountries.chartSel, centerCountriesVisited.slice(i,i+2), i, stepIndex);
				//drawLineCanva(context, centerCountriesVisited.slice(i,i+2), i);
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

	svg.selectAll(".dotVisitedGroup")
		.data(dataCenterCoordinates)
		.enter()
			.append("circle")
			.attr("class","dotVisited")
			/*
			.attr("class",(d) => {
				//console.log("drawCountriesCenter - drawing : ", d.name);
				return "c"+d.name; } )
				*/
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
function drawLineCanva(context, arrayCoordinates, idelay){

	console.log("countriesSteps - drawLineCanva - enter");

	const line = {
		x1: arrayCoordinates[0][0],
		y1: arrayCoordinates[0][1],
		x2: arrayCoordinates[1][0],
		y2: arrayCoordinates[1][1]
	}

	let i1 = d3.interpolateNumber(line.x1, line.x2);
	let i2 = d3.interpolateNumber(line.y1, line.y2);


	d3.transition()
		.delay(drawLineDelay*idelay)
		.duration(2*standardDuration+200)
		.tween("", function() {

	      return function(t) {

					//console.log("x1",line.x1);

					//console.log("i1(t)",i1(t));
					//console.log("i2(t)",i2(t));


					context.beginPath();
					context.lineWidth = 3;
					//context.setLineDash([5, 5]);
				  context.strokeStyle = lineColor;
					context.moveTo(line.x1,line.y1);
					//to improve ? I gues this is drawing multiple line on top of each other. But Canvas handle well a lot of element so ...
					context.lineTo(i1(t),i2(t));
					//context.lineTo(line.x2,line.y2); // draw at once
					context.stroke();

				}
		});


}
// draw a line between 2 points, given an array of coordinates
function drawLine(svg,arrayCoordinates,idelay,step){

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
		.attr("stroke", lineColor)
		.attr("stroke-width", 3)
		.attr("class", "line-"+step)
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

function highlightCountriesStep(chartCountries, visitedCountries, stepIndex, countryHighlightColor){

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
				centerY: centerY,
				stepIndex: stepIndex
			});
		};
	})

	//console.log(nodesArray);
	let offset = 0;
	const delay = forceDuration;
	nodesArray.forEach((d) => {
		setTimeout(function() {
	    //addNodeArrayToSim(simulation, d, forceData, chartCountries.chartSel);
			addNodeArrayToSimCanvas(simulation, d, forceData, chartCountries.chartSel);
		}, delay + offset)
		offset += delay;
	});
}

function eraseStep(stepId,countriesOnly,nodesOnly, forceData){
	if(countriesOnly){
		unlight(stepId);
		undrawLine(stepId);
		eraseCenter(stepId);
	}
	else if (nodesOnly) {
		//console.log("nodes only");
		deleteNodes(stepId, forceData);
	}
	else {
		unlight(stepId);
		undrawLine(stepId);
		eraseCenter(stepId);
		deleteNodes(stepId, forceData);
	}
}

function unlight(stepId) {
	chartCountries.chartSel
		.selectAll(".mapItem")
			.filter( (d) => {
				return d.stepIndex == stepId;
			})
			.transition()
				.duration(standardDuration/2)
				.attr("fill", (d,i) => {
					return countryColor;
				});
}

function undrawLine(stepId){
	chartCountries.chartSel
		.selectAll(".line-"+stepId)
		.remove();
}

function eraseCenter(stepId){
	chartCountries.chartSel
		.selectAll(".dotVisited")
			.filter( (d) => {
				return d.stepIndex == stepId;
			})
			.remove();
}

function showTipCountry(d) {

	tooltipCountries.html(printCountry(d))
		// On utilise style pour définir l'endroit d'affichage
		.style("left", (d3.event.pageX + 10) + "px")
		.style("top", (d3.event.pageY - 20) + "px");

	tooltipCountries.transition()
   		.duration(500)
   		.style("opacity", .9);
}

function hideTipCountry() {
	tooltipCountries.transition()
		.duration(500)
		.style("opacity", 0);
}

function printCountry(v) {
	return "<h4>" + v.name + "</h4> " + "<br/>" + "<b>" + v.people + "</b> people interviewed";
	/*
		+ "<br/>" + "<b>#" + v.rank + "</b> on overall ranking"
		+ "<br/> | tech #" + v.tech_rank + " | leadership #" + v.leadership_rank + " | "
		+ "<br/><br/>" + v.total_employees + " employees"
		+ "<br/><br/>" + v.sector + " | " + v.customer_base;
	*/
}

export { drawLineSteps, highlightCountriesStep, addNodesStep, showTipCountry, hideTipCountry, eraseStep };
