import * as d3 from "d3";
/* ---------------------- */
/* CONSTANTS */
/* ---------------------- */

const chartCountries = {
	stepSel: d3.select('#scrolly-1-countries').selectAll('.step'),
	svgId: "#chart-1-countries",
	chartSel: d3.select("#chart-1-countries"),
	svgProps: {
		width: 960,
		height: 600,
		margin: { top: 10, bottom: 10, left: 10, right: 10}
	}
}

// Canvas for background map
let canvas = d3.select('#canva-1-countries')
	.attr("width", chartCountries.svgProps.width /*+ chartCountries.svgProps.margin.left + chartCountries.svgProps.margin.right*/)
	.attr("height", chartCountries.svgProps.height /*+ chartCountries.svgProps.margin.top + chartCountries.svgProps.margin.bottom*/)

let context = canvas.node().getContext('2d');

// Canvas for nodes
let canvasForce = d3.select('#canva-1-force')
	.attr("width", chartCountries.svgProps.width /*+ chartCountries.svgProps.margin.left + chartCountries.svgProps.margin.right*/)
	.attr("height", chartCountries.svgProps.height /*+ chartCountries.svgProps.margin.top + chartCountries.svgProps.margin.bottom*/)

let contextForce = canvasForce.node().getContext('2d');

const countryColor = 'Gainsboro';

const standardDuration = 1000;
const forceDuration = 1300;
const drawLineDelay = standardDuration + 300;
const colorCountriesPause = 150;
const colorCenterPause = 200;
const dotVisitedColor = 'white';
const lineColor = "#80ceff";

// Const for FORCE
const nodePadding = 1;
const radius = 3.5;
const forceStrength = 0.4;
const centerX = chartCountries.svgProps.width/2;
const centerY = chartCountries.svgProps.height*0.9;
const forcePropsCluster = {
	forceX:{
		x: (d) => d.centerX,
		strength: forceStrength
	},
	forceY: {
		y: (d) => d.centerY,
		strength: forceStrength
	}
};
const alpha = 0.1;
const nodesColor = "#595959";

let forceData = [];

/// TOOLTIP ///
// Add a div that will go wherever in the body
var tooltipCountries = d3.select("body").append("div")
	.attr("class", "tooltip");
tooltipCountries.style("opacity", 0);

export {
  chartCountries,
	canvas,
	context,
	contextForce,
	countryColor,
  standardDuration,
  forceDuration,
  drawLineDelay,
  colorCountriesPause,
  colorCenterPause,
  dotVisitedColor,
	lineColor,
  nodePadding,
  radius,
  forceStrength,
  centerX,
  centerY,
  forcePropsCluster,
  alpha,
  nodesColor,
	forceData,
	tooltipCountries
};
