import * as d3 from "d3";
/* ---------------------- */
/* CONSTANTS */
/* ---------------------- */

const chartCountries = {
	stepSel: d3.select('#scrolly-1-countries').selectAll('.step'),
	svgId: "#chart-1-countries",
	chartSel: d3.select("#chart-1-countries"),
	svgProps: {
		width: 850,
		height: 600,
		margin: { top: 0, bottom: 0, left: 0, right: 0}
	}
}

const chartPeople = {
	stepSel: d3.select('#scrolly-2-people').selectAll('.step'),
	svgId: "#chart-2-people",
	chartSel: d3.select("#chart-2-people"),
	svgProps: {
		width: 960,
		height: 600,
		margin: { top: 0, bottom: 0, left: 0, right: 0}
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

let simulationPeople = d3.forceSimulation();

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
const alphaPeople = 0.2;
const nodesColor = "#595959";

let forceDataCountries = [];

/// TOOLTIP ///
// Add a div that will go wherever in the body
var tooltipCountries = d3.select("body").append("div")
	.attr("class", "tooltip");
tooltipCountries.style("opacity", 0);


/// PEOPLE CHART ///
const categoriesAttribute = ["Gender", "AgeCategory", "NumberKidsCategory","populationCategory", "Occupation type"];
const categoriesList = [
  {name: "genderCategory", text: "Gender", sorting : "key", array: ["F","M"]},
  {name: "ageCategory",  text: "Age", sorting : "key", array: ['0-15', '15-25', '25-35', '35-50', '50-65','65+']},
  {name: "kidsCategory",  text: "Number of kids", sorting : "key", array: ['0', '1', '2-5', '5+']},
  {name: "populationCategory",  text: "City Population", sorting : "key", array: ['0-5k', '5-15k', '15-100k','100k-1M', '1M-5M', '5M+']},
  {name: "occupationCategory",  text: "Occupation", sorting : "value", array: ['Student', 'Executive', 'Liberal profession and intellectual occupation', 'Religious', 'Retiree',
    'Artist', 'Teacher', 'Employee', 'Not paid occupation', 'Worker', 'Craftsmen, merchants & small business owner',
    'Farmer', 'Kid']},
];

const topBuffer = 400;
const yNodes = topBuffer/2 ;



export {
  chartCountries,
	chartPeople,
	canvas,
	context,
	contextForce,
	simulationPeople,
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
	alphaPeople,
  nodesColor,
	forceDataCountries,
	tooltipCountries,
	categoriesAttribute,
	categoriesList,
	topBuffer,
	yNodes
};
