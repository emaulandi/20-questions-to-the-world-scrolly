/* ---------------------- */
/* FORCE FUNCTION */
/* ---------------------- */
import * as d3 from "d3";
import { radius,  nodePadding, forcePropsCluster, alpha, nodesColor, chartCountries, contextForce, forceDataCountries, chartPeople} from './constants';

let forceCollide = d3.forceCollide()
  .strength(.8)
  .radius((d) => { return d.r + nodePadding; })
  .iterations(5);

function forceXYbuilder(x,y, forceStrength){
  return {
  	forceX:{
  		x: x,
  		strength: forceStrength
  	},
  	forceY: {
  		y: y,
  		strength: forceStrength
  	}
  }
}

function initializeSimulation(type, simulation, forceData, updateNetwork){
  console.log("forceUtils - initializeSimulation");
  //console.log("forceUtils - initializeSimulation - forceData : ", forceData);
	simulation.nodes(forceData);

  if (type == "countries"){
    initializeForce(simulation);
  }
  else {
    initializeForcePeople(simulation);
  }

	simulation.on("tick", updateNetwork);
}

function initializeForce(simulation){
  //console.log("forceUtils - initializeForce");
	simulation
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.force("collision", d3.forceCollide(radius + nodePadding));

  // set the force to cluster (node go to centerX, centerY in their properties)
	updateForce(simulation, forcePropsCluster);
}

function initializeForcePeople(simulation){
  //console.log("forceUtils - initializeForce");

	simulation
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.force("collision", forceCollide);

  // set the force to cluster (node go to centerX, centerY in their properties)
	updateForce(simulation, forcePropsCluster);
}

function updateForce(simulation, forceProps){

	simulation.force(
		"x",
		d3.forceX(forceProps.forceX.x).strength(forceProps.forceX.strength)
	);

	simulation.force(
		"y",
		d3.forceY(forceProps.forceY.y).strength(forceProps.forceY.strength)
	);

	simulation.alpha(alpha).restart();
}

function updateNetworkCountriesCanvas(){
  contextForce.clearRect(0, 0, chartCountries.svgProps.width, chartCountries.svgProps.height);
	contextForce.save();
	forceDataCountries.forEach(drawNodeCanvas);
	contextForce.restore();
}

function drawNodeCanvas(d) {

		contextForce.beginPath();
		contextForce.moveTo(d.x + radius, d.y);
		contextForce.arc(d.x, d.y, radius, 0, 2 * Math.PI);
		contextForce.fillStyle = nodesColor;
		contextForce.fill();
}

// used only if force on SVG
function updateNetworkCountries(){
	chartCountries.chartSel.selectAll(".nodes")
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
}

function updateNetworkPeople(){
  chartPeople.chartSel.selectAll(".nodes")
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
}

function addNodeArrayToSim(simulation, nodeArray, forceData, chartSel){
  nodeArray.forEach((node) => {
    forceData.push(node);
  });

  //console.log(forceData);
	restartForce(simulation, chartSel, forceData);
}

function addNodeArrayToSimCanvas(simulation, nodeArray, forceData, chartSel){
  nodeArray.forEach((node) => {
    forceData.push(node);
  });

  //console.log(forceData);
	restartForceCanvas(simulation, chartSel, forceData);
}

/*
// Check if not used -> delete
function cleanNodes(chartSel, forceData){
  console.log("Clean nodes");

  chartSel
		.selectAll(".nodes")
    .data(forceData)
    .exit()
    .remove();
}
*/
// restart when adding new nodes
function restartForce(simulation, chartSel, forceData){

  console.log("forceUtils - restartForce");

  chartSel
		.selectAll(".nodes")
        .data(forceData)
				.enter()
				.append("circle")
					.attr("class","nodes")
					.attr("r", radius)
					.style("stroke","white")
					.style("stroke-width",1)
          .style("fill",nodesColor);

  simulation.nodes(forceData);
  simulation.alpha(alpha).restart();
}

function restartCollide(simulation, alpha) {
  console.log("forceUtils - simpleRestart");

  forceCollide.initialize(simulation.nodes());
}

function restartForceCanvas(simulation, chartSel, forceData){

  simulation.nodes(forceData);

  updateNetworkCountriesCanvas();

  simulation.alpha(alpha).restart();
}

//clear here what is not needed to export
export {
  forceXYbuilder,
  initializeSimulation,
  initializeForcePeople,
  initializeForce,
  updateForce,
  updateNetworkCountries,
  updateNetworkPeople,
  addNodeArrayToSim,
  addNodeArrayToSimCanvas,
  restartForce,
  updateNetworkCountriesCanvas,
  restartCollide
};
