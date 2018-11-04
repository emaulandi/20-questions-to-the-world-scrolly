// for watch and hot reload
require('../index.html')
require('./style/base.scss')

import { drawMap, addVisitedCountriesCenter, drawMapCanva } from './mapsUtils';
import { drawLineSteps, highlightCountriesStep, addNodesStep, eraseStep } from './countriesSteps';
import { initializeSimulation, initializeForce, initializeForcePeople, updateNetworkCountries, updateForce, forceXYbuilder, updateNetworkCountriesCanvas, updateNetworkPeople } from './forceUtils';
import { chartCountries, chartPeople, visitedCountries, simulationPeople, simulationCountries, centerX, centerY, forcePropsCluster, forceStrength, countryColor, forceDataCountries, radius, nodesColor, categoriesList, categoriesAttribute, yNodes } from './constants';
import { updateNodesClusterCenter, updateNodesClusterCenterCategory, generateCategoryStats, drawRectLayout, showStep, addNodesOnClick, highlightNodes, unshowAllLegend } from './people-steps';

import * as d3 from "d3";

import Stickyfill from 'stickyfilljs';
import enterView from 'enter-view';

import './style/base.scss';
import './style/story-layout.scss';

import logoImg from './img/logo.png';
import collageImg from './img/collage20Q.jpg';
import countriesDataImport from './data/countries-light-modified.geojson';
import peopleDataImport from './data/peopleWithCategories.csv';

let logo = document.getElementById('logo');
logo.src = logoImg;

let collage = document.getElementById('collage');
collage.src = collageImg;

/* Global constants */
// Const fro scroll
const scrollOffset = 0.5;

// Const for MAP
//const countriesFilename = "data/countries-light-modified.geojson";


const countryHighlightColor = '#009cfc';

/* Global variables */
// Var for MAP
let visitedCountriesFeatures = null;
let otherCountriesFeatures = null;
let visitedCountriesName = null;
let proj = d3.geoMercator()
  .center([0, 20])
    .scale(150)
    .translate([centerX, chartCountries.svgProps.height/2]);
let path = d3.geoPath().projection(proj);

// Var for FORCE



let forceDataPeople ;

// step render of countries
const STEPcountries = {
	'begin': (type) => {
		console.log("-----------------First country");
		if (type){
			highlightCountriesStep(chartCountries, visitedCountries, 0, countryHighlightColor);
		}
		else {
			eraseStep(0,1,0);
		}
	},
	'showNodes': (type) => {
		console.log("-----------------show nodes");
		const stepIndex = 0;

		if (type){
			const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});
			addNodesStep(simulationCountries, chartCountries, countriesStep, stepIndex, forceDataCountries);
		}
		else {
			eraseStep(stepIndex,0,1);
		}
	},
	'europe': (type) => {
		console.log("-----------------+ 2 country");
		const stepIndex = 1;
		if (type){
			standardStepCountries(stepIndex);
		}
		else {
			eraseStep(stepIndex,0,0);
		}
	},
	'americas': (type) => {
		console.log("-----------------+ all country");
		const stepIndex = 2;
		if (type){
			standardStepCountries(stepIndex);
		}
		else {
			eraseStep(stepIndex,0,0);
		}
	},
	'asia': (type) => {
		console.log("-----------------+ all country");
		const stepIndex = 3;
		if (type){
			standardStepCountries(stepIndex);
		}
		else {
			eraseStep(stepIndex,0,0);
		}
	},
	'gather': (type) => {
		console.log("----------------- gathering");
		//center all the nodes
		if (type){
			updateForce(
				simulationCountries,
				forceXYbuilder(centerX, centerY, forceStrength)
			);

			//give the hand to the user to hover
			ableHover(1);
			//chartCountries.chartSel.classed("pointer-disabled", false);
		}
		else{
			ableHover(0);
			updateForce(
				simulationCountries,
				forcePropsCluster
			);
		}
	},
	'end':  (type) => {
		console.log("-----------------END");
		//make them go away
		if (type){
			updateForce(
				simulationCountries,
				forceXYbuilder(centerX, chartCountries.svgProps.height*1.5, forceStrength)
			);
		}
		else {
			updateForce(
				simulationCountries,
				forceXYbuilder(centerX, centerY, forceStrength)
			);
		}
	}
};

function ableHover(bool){
	if(bool){
		chartCountries.chartSel.classed("pointer-disabled", false);
		d3.select("article").classed("pointer-disabled", true);
	}
	else{
		chartCountries.chartSel.classed("pointer-disabled", true);
		d3.select("article").classed("pointer-disabled", false);
	}
}

function standardStepCountries(stepIndex){
	const countriesStep = visitedCountries.filter( (d) => {return d.stepIndex == stepIndex;});

	highlightCountriesStep(chartCountries, visitedCountries, stepIndex, countryHighlightColor);
	addNodesStep(simulationCountries, chartCountries, countriesStep, stepIndex, forceDataCountries);
}

// step render of people
const STEPpeople = {
	'begin': (type) => {
    console.log("-----------------begin");
    if (type){
  		// put the nodes at the center
  		updateNodesClusterCenter(simulationPeople, forceDataPeople, null, chartPeople.svgProps.height/2);

  		// enable pointers on the map
  		d3.select("#article-2-people").classed("pointer-disabled", true);
    }
	},
	'highlight': (type) => {
    console.log("-----------------highlight");
    if (type){
  		highlightNodes("on");
    }
    else {
      STEPpeople['close-highlight'](1);
    }
	},
	'close-highlight': (type) => {
    console.log("-----------------close");
    if (type){
  		highlightNodes("off");
    }
    else {
      STEPpeople['highlight'](1);
    }
	},
	'gender': (type) => {
    console.log("-----------------gender");
    if (type){
  		standardStepPeople(0);
    }
    else {
      //delete cluster legends
      d3.selectAll(".clusterLegendGroup").remove();
      // updateForce to center in big cluster
      updateNodesClusterCenter(simulationPeople, forceDataPeople, chartPeople.svgProps.width/2, chartPeople.svgProps.height/2);
    }
	},
	'age': (type) => {
    if (type){
  		console.log("-----------------age");
  		standardStepPeople(1);
    }
    else {
      STEPpeople['gender'](1);
    }
	},
	'kids': (type) => {
    if (type){
  		console.log("-----------------kids");
  		standardStepPeople(2);
    }
    else {
      STEPpeople['age'](1);
    }
	},
	'population': (type) => {
    if (type){
  		console.log("-----------------population");
  		standardStepPeople(3);
    }
    else {
      STEPpeople['kids'](1);
    }
	},
	'occupation': (type) => {
		console.log("-----------------occupation");
    if (type){
  		standardStepPeople(4);
    }
    else {
      STEPpeople['population'](1);
    }
	},
	'gather': (type) => {
		console.log("-----------------gather");
    if (type){
  		chartPeople.chartSel
  	    .selectAll(".clusterLegendGroup")
  	    .remove();

  		updateNodesClusterCenter(simulationPeople, forceDataPeople, chartPeople.svgProps.width/2, yNodes);
  		drawRectLayout();
  		addNodesOnClick(simulationPeople,forceDataPeople);
    }
    else {
      // delete all legends
      unshowAllLegend();
      // move back to occupation layout
      STEPpeople['occupation'](1);
    }
	},
  'buffer': (type) => {
    console.log("-----------------gather");
    if (type){
      // do nothing
    }
    else {
      // do nothing
    }
  }
}

function standardStepPeople(categoryID){
	updateNodesClusterCenterCategory(simulationPeople, chartPeople.svgProps, forceDataPeople, categoriesList[categoryID].array, categoriesAttribute[categoryID]);
	//showStep(categoriesAttribute[categoryID]);
}

function handleStepEnter(stepper,type,step){
	//console.log(step);
	stepper[step](type);
}

function svgSetUp(svgId,svgProps) {

	let svg = d3.select(svgId)
		.attr("width", svgProps.width + svgProps.margin.left + svgProps.margin.right)
		.attr("height", svgProps.height + svgProps.margin.top + svgProps.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + svgProps.margin.left + "," + svgProps.margin.top + ")");

	//console.log(svg);
	return svg;
}

function initScroll() {
	console.log('init Scroll');
	Stickyfill.add(d3.select('.sticky').node());

	// chart 1 : map
	//console.log('init Scroll - MAP - selector ', chartCountries.stepSel.nodes());
	enterView({
		selector: chartCountries.stepSel.nodes(),
		offset: scrollOffset,
		enter: el => {
			//const index = +d3.select(el).attr('data-index');
			console.log('MAP enter ' + d3.select(el).attr('data-index'));

			handleStepEnter(STEPcountries,1,d3.select(el).attr('data-step'));

		},
		exit: el => {
			console.log('MAP exit : ' + d3.select(el).attr('data-index'));
			handleStepEnter(STEPcountries,0,d3.select(el).attr('data-step'));

		}
	});

	// chart 2 : people
	//console.log('init Scroll - PEOPLE - selector', chartPeople.stepSel.nodes());
	enterView({
		selector: chartPeople.stepSel.nodes(),
		offset: scrollOffset,
		enter: el => {
			//const index = +d3.select(el).attr('data-index');
			console.log('PEOPLE enter ' + d3.select(el).attr('data-index'));

			handleStepEnter(STEPpeople,1,d3.select(el).attr('data-step'));

		},
		exit: el => {
			console.log('PEOPLE exit : ' + d3.select(el).attr('data-index'));
			//let index = +d3.select(el).attr('data-index');
			//index = Math.max(0, index - 1);

      handleStepEnter(STEPpeople,0,d3.select(el).attr('data-step'));

		}
	});
}

function initChart(){

	console.log('init Chart');

	// chart 1
	svgSetUp(chartCountries.svgId, chartCountries.svgProps);

	// draw responsive country on svg
	drawMap(chartCountries.chartSel, visitedCountriesFeatures, path, countryColor);

	// draw background countries on canvas
	drawMapCanva(path,otherCountriesFeatures);

	// chart 2
	svgSetUp(chartPeople.svgId, chartPeople.svgProps);

	// draw set of rectangles to displya propotion of people in different categories
	//drawRectLayout();

}

function loadDataCountries(){
	console.log("loadDataCountries()");

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
			c.stepIndex = visitedCountries.find((u) => u.name == c.properties.ADMIN).stepIndex ;
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

function loadDataPeople(){
	console.log("loadDataPeople()");

	return new Promise((resolve, reject) => {

		console.log("peopleDataImport",peopleDataImport);
		//forceDataPeople.push({test:"yolo"});

		forceDataPeople = peopleDataImport ;

		forceDataPeople.forEach( (d) => {
			d.centerX = chartPeople.svgProps.width/2 ;
			d.centerY = -200;
			d.r = radius;
		});
		/*
		/ not working -> 404 not found
		d3.csv("data/peopleWithCategories.csv", function(err, res){
			console.log(err, res);
		})
		*/

		generateCategoryStats(forceDataPeople);

		resolve();

	});
}

function initForce(){
	console.log("intiForce");

	//initializeSimulation(simulation, forceData, updateNetworkCountries);
	initializeSimulation("countries",simulationCountries, forceDataCountries, updateNetworkCountriesCanvas);

	// do not append nodes if using Canvas

	initializeSimulation("people",simulationPeople, forceDataPeople, updateNetworkPeople);

	chartPeople.chartSel
		.append("g")
		.attr("class","nodesItems")
		.selectAll("circle")
			.data(forceDataPeople)
				.enter()
				.append("circle")
					.attr("class","nodes")
					.attr("r", radius)
					//.style("stroke","white")
					//.style("stroke-width",1)
					.style("fill",nodesColor);

}

function init(){

	console.log("init");

	Promise.all([
		loadDataCountries(),
		loadDataPeople()

	]).then(() => {
		console.log("YOLOOO");
		initScroll();
		initChart();
		console.log("fin YOLOOO");
		initForce();


	}, function(err) {
		console.log(err);
	});


}


init();
