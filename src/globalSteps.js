// for watch and hot reload
require('../index.html')
import { drawMap, addVisitedCountriesCenter, drawMapCanva } from './mapsUtils';
import { drawLineSteps, highlightCountriesStep, addNodesStep } from './countriesSteps';
import { initializeSimulation, initializeForce, updateNetworkCountries, updateForce, forceXYbuilder, updateNetworkCountriesCanvas } from './forceUtils';
import { chartCountries, centerX, centerY, forceStrength, countryColor, forceData } from './constants';

import * as d3 from "d3";
import Stickyfill from 'stickyfilljs';
import enterView from 'enter-view';

import './style/base.scss';
import './style/story-layout.scss';

import logoImg from './img/logo.png';
import countriesDataImport from './data/countries-light-modified.geojson';

let logo = document.getElementById('logo');
logo.src = logoImg;

/* Global constants */
// Const fro scroll
const scrollOffset = 0.5;
// Const for svg


// Const for MAP
const countriesFilename = "data/countries-light-modified.geojson";
let visitedCountries = [
	{name:'France', id: 1, stepIndex: 0, people: 82},
	{name:'Spain', id: 2, stepIndex: 1, people: 22},
	{name:'United Kingdom', id: 3, stepIndex: 1, people: 32},
	{name:'Turkey', id: 4, stepIndex: 1, people: 10},
	{name:'Argentina', id: 5, stepIndex: 2, people: 30},
	{name:'Bolivia', id: 6, stepIndex: 2, people: 18},
	{name:'Peru', id: 7, stepIndex: 2, people: 3},
	{name:'Brazil', id: 8, stepIndex: 2, people: 16},
	{name:'Colombia', id: 9, stepIndex: 2, people: 12},
	{name:'United States of America', id: 10, stepIndex: 2, people: 42},
	{name:'Russia', id: 11, stepIndex: 2, people: 17},
	{name:'Mongolia', id: 12, stepIndex: 2, people: 22},
	{name:'Singapore', id: 13, stepIndex: 2, people: 9},
	{name:'Myanmar', id: 14, stepIndex: 2, people: 20},
	{name:'India', id: 15, stepIndex: 2, people: 44},
	{name:'Nepal', id: 16, stepIndex: 2, people: 20},
	{name:'Iran', id: 17, stepIndex: 2, people: 21},
	{name:'Ethiopia', id: 18, stepIndex: 2, people: 24}
];

const countryHighlightColor = '#009cfc';

/* Global variables */
// Var for MAP
let visitedCountriesFeatures = null;
let otherCountriesFeatures = null;
let visitedCountriesName = null;
let proj = d3.geoMercator()
  .center([0, 20])
    .scale(140)
    .translate([centerX, chartCountries.svgProps.height/2]);
let path = d3.geoPath().projection(proj);

// Var for FORCE
let simulation = d3.forceSimulation();

// step render
const STEPcountries = {
	'begin': () => {
		console.log("-----------------First country");
		highlightCountriesStep(chartCountries, visitedCountries, 0, countryHighlightColor);
	},
	'showNodes': () => {
		console.log("-----------------show nodes");

		const stepIndex = 0;
		const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});

		addNodesStep(simulation, chartCountries, countriesStep, stepIndex, forceData);
	},
	'middle': () => {
		console.log("-----------------+ 2 country");

		const stepIndex = 1;
		const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});

		highlightCountriesStep(chartCountries, visitedCountries, stepIndex, countryHighlightColor);
		addNodesStep(simulation, chartCountries, countriesStep, stepIndex, forceData);
	},
	'climax': () => {
		console.log("-----------------+ all country");

		const stepIndex = 2;
		const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});

		highlightCountriesStep(chartCountries, visitedCountries, stepIndex, countryHighlightColor);
		addNodesStep(simulation, chartCountries, countriesStep, stepIndex, forceData);
	},
	'gather':  () => {
		console.log("----------------- gathering");
		//center all the nodes
		updateForce(
			simulation,
			forceXYbuilder(centerX, centerY, forceStrength)
		);
	},
	'end':  () => {
		console.log("-----------------END");
		//make them go away
		updateForce(
			simulation,
			forceXYbuilder(centerX, chartCountries.svgProps.height*1.5, forceStrength)
		);
		// enable pointers on the map
		d3.select("article").classed("pointer-disabled", true);
	}
};

function handleStepEnter(step){
	console.log(step);
	STEPcountries[step]();
}

function svgSetUp(svgId,svgProps) {

	let svg = d3.select(svgId)
		.attr("width", svgProps.width /*+ svgProps.margin.left + svgProps.margin.right*/)
		.attr("height", svgProps.height /*+ svgProps.margin.top + svgProps.margin.bottom*/)
		.append("g")
			.attr("transform", "translate(" + svgProps.margin.left + "," + svgProps.margin.top + ")");

	//console.log(svg);
	return svg;
}

function initScroll() {
	console.log('init Scroll');
	//console.log('init Scroll - stepSel.nodes()', chartCountries.stepSel.nodes());
	Stickyfill.add(d3.select('.sticky').node());

	enterView({
		selector: chartCountries.stepSel.nodes(),
		offset: scrollOffset,
		enter: el => {
			const index = +d3.select(el).attr('data-index');
			console.log('enter ' + d3.select(el).attr('data-index'));

			handleStepEnter(d3.select(el).attr('data-step'));

		},
		exit: el => {
			console.log('exit : ' + d3.select(el).attr('data-index'));
			let index = +d3.select(el).attr('data-index');
			index = Math.max(0, index - 1);

		}
	});
}

function initChart(){

	svgSetUp(chartCountries.svgId, chartCountries.svgProps);

	drawMap(chartCountries.chartSel, visitedCountriesFeatures, path, countryColor);

	drawMapCanva(path,otherCountriesFeatures);

}

function loadData(){
	console.log("loadData()");

	visitedCountriesName = visitedCountries.map((d)=>{return d.name});

	console.log("visitedCountriesName",visitedCountriesName);

	return new Promise((resolve, reject) => {

		//console.log(countriesDataImport.features);
		let countriesDataTemp = countriesDataImport.features;

		// select only the ones in visited countries
		visitedCountriesFeatures = countriesDataTemp.filter( (d) => {
			return visitedCountriesName.includes(d.properties.ADMIN);
		});

		//add ID from visitedCountry and sort them to appear in the right order
		visitedCountriesFeatures.forEach( (c) => {
			c.id = visitedCountries.find((u) => u.name == c.properties.ADMIN).id ;
			c.name =  c.properties.ADMIN ;
			c.people =  visitedCountries.find((u) => u.name == c.properties.ADMIN).people ;
		})
		visitedCountriesFeatures.sort((a,b) => a.id - b.id);

		otherCountriesFeatures = countriesDataTemp.filter( (d) => {
			return !visitedCountriesName.includes(d.properties.ADMIN);
		});


		// compute center of a country and add it to the object @ mapsUtils
		addVisitedCountriesCenter(proj,visitedCountriesFeatures,visitedCountries);
		console.log("loadData() - visitedCountries", visitedCountries);

	//	console.log("loadData() end before resolve");
		resolve();

	});
}

function initForce(){
	console.log("intiForce");

	//initializeSimulation(simulation, forceData, updateNetworkCountries);
	initializeSimulation(simulation, forceData, updateNetworkCountriesCanvas);

	// do not append nodes if using Canvas
	/*
	chartCountries.chartSel
		.append("g")
		.attr("class","nodesItems")
		.selectAll("circle")
			.data(forceData)
				.enter()
				.append("circle")
					.attr("class","nodes")
					.attr("r", radius)
					.style("stroke","white")
					.style("stroke-width",1)
					.style("fill",nodesColor);
	*/
}

function init(){

	console.log("init");

	loadData().then(() => {

		initScroll();
		initChart();
		initForce();
	});

}


init();
