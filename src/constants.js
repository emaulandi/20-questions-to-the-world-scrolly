import * as d3 from "d3";
/* ---------------------- */
/* CONSTANTS */
/* ---------------------- */

const chartCountries = {
	stepSel: d3.select('#scrolly-1-countries').selectAll('.step'),
	svgId: "#chart-1-countries",
	chartSel: d3.select("#chart-1-countries"),
	svgProps: {
		width: 930,
		height: 600,
		margin: { top: 10, bottom: 10, left: 10, right: 10}
	}
}
const standardDuration = 1000;
const forceDuration = 1300;
const drawLineDelay = standardDuration + 300;
const colorCountriesPause = 150;
const colorCenterPause = 200;
const dotVisitedColor = 'white';

// Const for FORCE
const nodePadding = 1;
const radius = 3.5;
const forceStrength = 0.4;
const centerX = chartCountries.svgProps.width/2;
const centerY = chartCountries.svgProps.height*0.8;
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


export {
  chartCountries,
  standardDuration,
  forceDuration,
  drawLineDelay,
  colorCountriesPause,
  colorCenterPause,
  dotVisitedColor,
  nodePadding,
  radius,
  forceStrength,
  centerX,
  centerY,
  forcePropsCluster,
  alpha,
  nodesColor
};
