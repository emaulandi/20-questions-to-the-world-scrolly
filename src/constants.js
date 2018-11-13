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

const visitedCountries = [
	{name:'France', id: 1, stepIndex: 0, people: 82, month: "September 2016"},
	{name:'Spain', id: 2, stepIndex: 1, people: 22, month: "October 2016"},
	{name:'United Kingdom', id: 3, stepIndex: 1, people: 32, month: "November 2016"},
	{name:'Turkey', id: 4, stepIndex: 1, people: 10, month: "November 2016"},
	{name:'Argentina', id: 5, stepIndex: 2, people: 30, month: "January to February 2017"},
	{name:'Bolivia', id: 6, stepIndex: 2, people: 18, month: "March 2017"},
	{name:'Peru', id: 7, stepIndex: 2, people: 3, month: "March 2017"},
	{name:'Brazil', id: 8, stepIndex: 2, people: 16, month: "April 2017"},
	{name:'Colombia', id: 9, stepIndex: 2, people: 12, month: "May 2017"},
	{name:'United States of America', id: 10, stepIndex: 2, people: 42, month: "May to June 2017"},
	{name:'Russia', id: 11, stepIndex: 3, people: 17, month: "July 2017"},
	{name:'Mongolia', id: 12, stepIndex: 3, people: 22, month: "July to August 2017"},
	{name:'Singapore', id: 13, stepIndex: 3, people: 9, month: "August 2017"},
	{name:'Myanmar', id: 14, stepIndex: 3, people: 20, month: "August to September 2017"},
	{name:'India', id: 15, stepIndex: 3, people: 44, month: "September to October 2017"},
	{name:'Nepal', id: 16, stepIndex: 3, people: 20, month: "October 2017"},
	{name:'Iran', id: 17, stepIndex: 3, people: 21, month: "November 2017"},
	{name:'Ethiopia', id: 18, stepIndex: 3, people: 24, month: "December 2016 to January 2018"}
];

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

let simulationCountries = d3.forceSimulation();
let simulationPeople = d3.forceSimulation();

const countryColor = '#d9d9d9';

const standardDuration = 700;
const forceDuration = 880;
const drawLineDelay = standardDuration + 100;
const colorCountriesPause = 40;
const colorCenterPause = 10;

//slower
//const standardDuration = 1000;
//const forceDuration = 1300;
//const drawLineDelay = standardDuration + 300;
//const colorCountriesPause = 150;
//const colorCenterPause = 200;
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
const nodesColor = "#8c8c8c";

let forceDataCountries = [];


/// TOOLTIP ///
// Add a div that will go wherever in the body
var tooltipCountries = d3.select("body").append("div")
	.attr("class", "tooltip");
tooltipCountries.style("opacity", 0);


/// PEOPLE CHART ///
const categoriesAttribute = ["Gender", "AgeCategory", "NumberKidsCategory","populationCategory", "Occupation type"];
const categoriesList = [
  {name: "genderCategory", color: "#ff2a00", text: "Gender", sorting : "key", array: ["F","M"]},
  {name: "ageCategory",  color: "#ffdcd2", text: "Age", sorting : "key", array: ['0-15', '15-25', '25-35', '35-50', '50-65','65+']},
  {name: "kidsCategory",  color: "#009cfc", text: "Number of kids", sorting : "key", array: ['0', '1', '2-5', '5+']},
  {name: "populationCategory",  color: "#ffec00", text: "City Population", sorting : "key", array: ['0-5k', '5-15k', '15-100k','100k-1M', '1M-5M', '5M+']},
  {name: "occupationCategory",  color: "#00e27b", text: "Occupation", sorting : "value", array: ['Student', 'Executive', 'Liberal profession and intellectual occupation', 'Religious', 'Retiree',
    'Artist', 'Teacher', 'Employee', 'Not paid occupation', 'Worker', 'Craftsmen, merchants & small business owner',
    'Farmer', 'Kid']},
];

const topBuffer = 440;
const yNodes = topBuffer/2 ;



export {
  chartCountries,
	chartPeople,
	visitedCountries,
	canvas,
	context,
	contextForce,
	simulationCountries,
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
