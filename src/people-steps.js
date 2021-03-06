import * as d3 from "d3";
import { updateForce, restartCollide, restartForce } from './forceUtils';
import { forcePropsCluster, alpha, chartPeople, categoriesAttribute, categoriesList, topBuffer, yNodes, alphaPeople, tooltipCountries, radius, simulationPeople, nodesColor } from './constants';

const imgPath = "img/square/";

const leftBuffer = 150;
const marginText = 30;

const marginInnerSide = 5;
const partHeight = (chartPeople.svgProps.height-topBuffer)/5;
const partWidth = (chartPeople.svgProps.width-marginText)/5;
const rectHeight = 20;

let categoriesValue = [];
let totalPeople;

const chartCut = 4;
const chartPixel = 7;

const peopleDuration = 800;

const bigR = 100;
const bigNodeDuration = 950;
const colorBigNode = "#f2f2f2";
const colorNodeWithImg = "black";

const durationLegend = 700;
const delayLegend = 600;
const clusterLegendPadding = 100;
const timerAddImg = 1400;

const rectColor = "#b3b3b3";
const backgroudColor = colorBigNode;

//scale for points 0 = 180px, 100 = 930px
let xPxScale = d3.scaleLinear()
    .range([leftBuffer+marginInnerSide,chartPeople.svgProps.width-marginInnerSide])
    .domain([0,100]);

//scale for length within this perimeter
let xScale = d3.scaleLinear()
    .range([0,chartPeople.svgProps.width-marginInnerSide-(leftBuffer+marginInnerSide)])
    .domain([0,100]);

let xScaleBlock = d3.scaleLinear()
    .range([0,partWidth])
    .domain([0,75]);

// from pixel to % value
let xInvertScale = d3.scaleLinear()
    .domain([0,chartPeople.svgProps.width-marginInnerSide-(leftBuffer+marginInnerSide)])
    .range([0,100]);

let xInvertScaleBlock = d3.scaleLinear()
    .domain([0,partWidth])
    .range([0,75]);

function drawRectLayout(){
	//console.log("people-steps - generateCategoryStats - drawRectLayout");
	//setUpLayout();
  setUpText();
  setupRectCategory();
  setUpTextLegend();
}

function setUpLayout(){
	//console.log("people-steps - generateCategoryStats - setUpLayout");

  const layoutRect = [
		{x: 0, y: 0, width: leftBuffer, height: 5*partHeight + topBuffer, fill: "#f2f2f2"},
    {x: 0, y: 5*partHeight, width: chartPeople.svgProps.width, height: 0, fill: "#f2f2f2"}
  ];

	let i;
  for (i=0;i<5;i++){
    layoutRect.push(
      {x: leftBuffer, y: i*partHeight + topBuffer, width: chartPeople.svgProps.width-leftBuffer, height: partHeight, fill: "#f2f2f2"}
    );
  }

  chartPeople.chartSel.selectAll("rect")
    .data(layoutRect)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .style("fill", (d) => d.fill);
}

function setUpText(){

	//console.log("people-steps - generateCategoryStats - setUpText");

	const textCategoryItems = categoriesList.map ((d) => {
		return d.text;
	})

  const textCategory = [];
	let i;
  for (i=0; i<textCategoryItems.length; i++){
    textCategory.push(
      {
				x: marginText + i*partWidth,
				y: topBuffer,
				categoriesAttribute: categoriesAttribute[i],
				text: textCategoryItems[i]
			}
    );
  }
  /*
  for (i=0; i<textCategoryItems.length; i++){
    textCategory.push(
      {
				x: leftBuffer - marginText,
				y: partHeight/2 + i*partHeight + topBuffer,
				categoriesAttribute: categoriesAttribute[i],
				text: textCategoryItems[i]
			}
    );
  }
  */

  chartPeople.chartSel
    .append("g")
    .attr("class", "textGroup")
    .selectAll(".textCategory")
      .data(textCategory)
      .enter()
      .append("text")
      .attr("class", "textCategory")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y /*+ rectHeight/4*/)
      //.attr("text-anchor", "end")
      .attr("text-anchor", "start")
      .text(function(d){return d.text})
			.style("opacity",0)
      .transition()
        .delay( (d,i) => { return delayLegend*i })
        .duration(durationLegend)
          .style("opacity",1)
}

function getXlegend(i,j){
  const mod = 6;
  let x = marginText + i*partWidth;

  if (j > mod){
    x = marginText + i*partWidth + partWidth/2;
  }

  return x;
}

function getYlegend(j){
  const mod = 6;
  let y = topBuffer + j*rectHeight + rectHeight/4;

  if (j> mod){
    y = topBuffer + (j%mod)*rectHeight + rectHeight/4;
  }

  return y;
}

function generateTextLegend(legendArray){
  let legendCategory = [];
  let lastX = xPxScale(0);
  let width, x ;

  legendArray.forEach( (row, i) => {

    row.forEach( (item, j) => {
      //width = xScale(item);
      x = lastX;

      width = xScaleBlock(item);
      legendCategory.push(
        {
          x: getXlegend(i,j)/*marginText + i*partWidth*/,
          y: getYlegend(j)/*topBuffer + j*rectHeight + rectHeight/4*/,
					width: width,
					categoriesAttribute: categoriesAttribute[i],
          categoryID: i,
          category: categoriesList[i].array[j],
          //get name of current item in category row (ex: "H" from GenderCategory)
          text: shortenText(categoriesList[i].array[j], partWidth/2, 1)
        }
      );

      /*
      legendCategory.push(
        {
          x: x,
          y: partHeight/2 + i*partHeight - rectHeight/2 + topBuffer,
					width: width,
					categoriesAttribute: categoriesAttribute[i],
          categoryID: i,
          //get name of current item in category row (ex: "H" from GenderCategory)
          text: categoriesList[i].array[j]
        }
      );
      */

      lastX += width;
    });

    lastX = xPxScale(0);
  });

  return legendCategory;

}

function setUpTextLegend(){

	//console.log("people-steps - generateCategoryStats - setUpTextLegend");

  console.log("legendCategory", categoriesValue);
  const legendCategory = generateTextLegend(categoriesValue);
  console.log("legendCategory", legendCategory);

  chartPeople.chartSel
    .append("g")
    .attr("class", "legendGroup")
    .selectAll(".legendCategory")
      .data(legendCategory)
      .enter()
      .append("text")
      .attr("class", "legendCategory")
      .attr("x", (d) => d.x + marginInnerSide)
      //.attr("x", (d) => d.x + d.width/2)
      .attr("y", (d) => d.y + 3*rectHeight/5)
      //.attr("text-anchor", "middle")
      .attr("text-anchor", "start")
			/*
      .attr("transform", (d) => {
        return "rotate(-25," + d.x + "," + d.y +")";
      })
			*/
			.style("opacity",0)
      .text( (d) => {
				let text = d.text;
        /*
				if (text.length > Math.round(d.width/chartPixel)){
					text = shortenText(d.text, d.width, 0);
				}
        */
				return text;
			})
      .on("mouseover", (d,i) => {
        showTip(d,"stats");
      })
      .on("mouseout", (d,i) => {
        hideTip();
      })
      .transition()
        .delay( (d) => { return delayLegend * d.categoryID })
        .duration(durationLegend)
          .style("opacity",1)
}

function shortenText(text, width, optionDots){

  let max = Math.round(width/chartPixel);
  let finalText = text;

  if (text.length > max){
    finalText = text.substring(0, max) ;
    if (optionDots) {
      finalText += "...";
    }
  }

	return finalText ;
}

function generateRectVal(rectArray){

  let rectCategory = [];
  let lastX = xPxScale(0);
  let width, x ;

  rectArray.forEach( (row, i) => {
    //console.log(row);
    row.forEach( (item, j) => {

      //console.log("start lastX",lastX);
      //console.log("item",item);
      //console.log("width",width);

      //width = xScale(item);
      width = xScaleBlock(item);

      x = lastX;

      rectCategory.push(
        {
					x: getXlegend(i,j)/*marginText + i*partWidth*/,
					y: getYlegend(j)/*topBuffer + j*rectHeight + rectHeight/4*/,
					width: width,
					height: rectHeight,
					categoriesAttribute: categoriesAttribute[i],
          categoryID : i,
					category: categoriesList[i].array[j]
				}
      );

      /*
      rectCategory.push(
        {
					x: x,
					y: partHeight/2 + i*partHeight - rectHeight/2,
					width: width,
					height: rectHeight,
					categoriesAttribute: categoriesAttribute[i],
          categoryID : i,
					category: categoriesList[i].array[j]
				}
      );
      */

      lastX += width;

      //console.log("end lastX",lastX);
    });

    lastX = xPxScale(0);
  });

  return rectCategory;
}

function setupRectCategory(){

	//console.log("people-steps - generateCategoryStats - drawRectLayout");

  const rectCategory = generateRectVal(categoriesValue);
  console.log("rectCategory", rectCategory);

  chartPeople.chartSel
    .append("g")
    .attr("class", "rectCategoryGroup")
    .selectAll(".rectCategory")
      .data(rectCategory)
      .enter()
      .append("rect")
      .attr("class", (d) => "rectCategory " + getClassItem(d.category))
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      //.attr("x", (d) => d.x)
      //.attr("y", (d) => d.y + topBuffer)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .style("fill", rectColor)
      .style("stroke-width", 3)
      .style("stroke", backgroudColor)
			.style("opacity",0)
      .on("mouseover", (d,i) => {

        /*
        d3.select(d3.event.target)
          .style("stroke-width",3);
        */

        showTip(d,"stats");
      })
      .on("mouseout", (d,i) => {

        /*
        d3.select(d3.event.target)
          .style("stroke-width",1);
        */
        hideTip();
      })
      .transition()
        .delay( (d) => { return delayLegend * d.categoryID })
        .duration(durationLegend)
          .style("opacity",1)
}

function showStep(categoriesAttribute){

	//show rectangles
	chartPeople.chartSel
		.selectAll(".rectCategory")
		.filter( (d) => { return d.categoriesAttribute == categoriesAttribute})
		.transition()
			.duration(peopleDuration)
			.style("opacity",1);

	// show legend
	chartPeople.chartSel
		.selectAll(".legendCategory")
		.filter( (d) => { return d.categoriesAttribute == categoriesAttribute})
		.transition()
			.duration(peopleDuration)
			.style("opacity",1);

	// show text of category
	chartPeople.chartSel
		.selectAll(".textCategory")
		.filter( (d) => { return d.categoriesAttribute == categoriesAttribute})
		.transition()
			.duration(peopleDuration)
			.style("opacity",1);
}

function generateCategoryStats(data){

	totalPeople = data.length;

  let stats, sum, perc ;
  categoriesAttribute.forEach( (cat,i) => {

    //console.log(cat);

    stats = d3.nest()
      .key(function(d) { return d[cat]; })
      .rollup(function(v) { return v.length; })
      .entries(data);


    stats.sort((it1, it2) => {

      if (categoriesList[i].sorting == "key"){
        //console.log(it1.key);
        //console.log(categoriesList[i].array.findIndex((d) => d == it1.key));
        // Sort the array in the same order that the categories (ex: 0 - 1 - 2-3 childs)
      	return categoriesList[i].array.findIndex((d) => d == it1.key) - categoriesList[i].array.findIndex((d) => d == it2.key);
      }
      else{
        // Or by values
        return it2.value - it1.value;

      }
    });

    // if sorted by value, sort back the label array
    if (categoriesList[i].sorting == "value"){
      categoriesList[i].array.sort( (a,b) => {
        return stats.findIndex((d) => d.key == a) - stats.findIndex((d) => d.key == b);
      });
    }

    //console.log("people-steps - generateCategoryStats - stats",stats);

    //gender
    //0: Object { key: "F", value: 229 }
    //1: Object { key: "M", value: 208 }

    perc = stats.map((d) => {
      return roundDecimal(d.value / totalPeople);
    });
    //console.log("people-steps - generateCategoryStats - perc",perc);

    categoriesValue.push(perc);
  })

  console.log("people-steps - generateCategoryStats - categoriesValue",categoriesValue);
}

function generateClusterPositionHorizontal(svgProps,topicsNumber){
	let clusterPosition = [];
  let i ;
  let yCenter = chartPeople.svgProps.height/2 ;



  if (topicsNumber <= 6){
    for(i=0;i<topicsNumber;i++){
  		clusterPosition.push({x: (i+1)*svgProps.width/(topicsNumber+1), y: yCenter});
  	}
  }
  // create clusters on 2 two levels above 6 items in a category
  else{

    const reference = topicsNumber/2 ;
    //console.log("people-steps -- generateClusterPositionHorizontal - reference",reference);
    //console.log("people-steps -- generateClusterPositionHorizontal - topicsNumber",topicsNumber);

    for(i=0;i<topicsNumber;i++){
      if (i < reference ) {
  		  clusterPosition.push({x: (i+1)*svgProps.width/(reference+1), y: 2*yCenter/3});
      }
      else{
        clusterPosition.push({x: (i%(Math.round(reference))+1)*svgProps.width/reference, y: yCenter + yCenter/3});
      }
  	}
  }

  //console.log(clusterPosition);
	return clusterPosition;
}

function updateNodesClusterCenter(simulation, data, x, y){

  console.log("people-steps -- updateNodesClusterCenter");
  data.forEach( (d,i) => {
    if (x != null ){
      d.centerX = x;
    }
    if (y != null ){
		    d.centerY = y;
    }
  });

  updateForce(simulation, forcePropsCluster);
	simulation.alpha(alpha+0.1).restart();
}

function updateNodesClusterCenterCategory(simulation, svgProps, data, category, categoryName){

	const position = generateClusterPositionHorizontal(svgProps, category.length);

	//console.log(" people-steps - updateNodesClusterCenterCategory - position", position) ;
	//console.log(" people-steps - updateNodesClusterCenterCategory - category", category) ;


	data.forEach( (d,i) => {
		//console.log(" people-steps - updateNodesClusterCenterCategory -(d[categoryName]",(d[categoryName].toString())) ;
		d.centerX = position[category.indexOf(d[categoryName].toString())].x;
		d.centerY = position[category.indexOf(d[categoryName].toString())].y;
	});

	updateForce(simulation, forcePropsCluster);
	simulation.alpha(alphaPeople).restart();
  simulation.alpha(0.2).restart();

  showClusterLegend(position, category);
}

function showClusterLegend(position, category){
  //categoriesList[categoryID].array, categoriesAttribute[categoryID]);
  chartPeople.chartSel
    .selectAll(".clusterLegendGroup")
    .remove();

  chartPeople.chartSel
    .append("g")
    .attr("class", "clusterLegendGroup")
    .selectAll(".clusterLegend")
      .data(category)
      .enter()
      .append("text")
      .attr("class", "clusterLegend")
      .attr("x", (d,i) => position[i].x)
      .attr("y", (d,i) => position[i].y + clusterLegendPadding)
      .attr("text-anchor", "middle")
			.style("opacity",0)
      .text( (d,i) => {
        return shortenText(d, 120, 1) ;
			})
      .transition()
        .duration(durationLegend)
          .style("opacity",1)
}

function unshowAllLegend(){
  d3.selectAll(".rectCategoryGroup").remove();
  d3.selectAll(".legendGroup").remove();
  d3.selectAll(".textGroup").remove();
}

function getNodeColor(imgName){
  if (imgName == "soon.jpg"){
    return nodesColor;
  }
  else{
    return colorNodeWithImg;
  }
}

function updateNodeColor(type){
  chartPeople.chartSel
    .selectAll(".nodes")
    .transition()
      .duration(delayLegend)
      .style("fill", (d,i) => {
        if (type == "on") {
          return getNodeColor(d.img);
        }
        else{
          return nodesColor;
        }
      });
}

function showTip(d,type) {
  if (type == "nodes"){
    tooltipCountries.html(printNodes(d))
  		.style("left", (d3.event.pageX + 10) + "px")
  		.style("top", (d3.event.pageY - 20) + "px");
  }
  else{
    tooltipCountries.html(printStats(d))
  		.style("left", (d3.event.pageX + 10) + "px")
  		.style("top", (d3.event.pageY - 20) + "px");
  }
	tooltipCountries.transition()
   		.duration(500)
   		.style("opacity", .9);
}

function hideTip() {
	tooltipCountries.transition()
		.duration(500)
		.style("opacity", 0);
}

function printStats(v) {
	return "<b>" + /* v.categoriesAttribute + " : " +*/ v.category+ "</b> : " + Math.round(xInvertScaleBlock(v.width),1) + " %";
	/*
		+ "<br/>" + "<b>#" + v.rank + "</b> on overall ranking"
		+ "<br/> | tech #" + v.tech_rank + " | leadership #" + v.leadership_rank + " | "
		+ "<br/><br/>" + v.total_employees + " employees"
		+ "<br/><br/>" + v.sector + " | " + v.customer_base;
	*/
}

function printNodes(v) {
	return "<b>" +  v["First Name"] + "</b>, " + v.Age +  " years old from " + v.Country;
}

function roundDecimal(n){
  return Math.round( 100 * n * 10 ) / 10 ;
}

function getClassItem(item){
  let text = "class" + shortenText(item, 70, 0);
  let withoutplus = text.replace(/\W/,"");
  /*
  let aclass = "class" +  shortenText(item, 70, 0);
  // delete the + that is not taken in a class name
  let regex = '/+/i';
  let withoutplus = aclass.replace(regex, '');
  console.log("getClassItem - withoutplus", withoutplus);
  */
  return (withoutplus);
}

function addNodesOnClick(simulation,forceData) {
  console.log("peopleSteps -- addNodesOnClick");
  chartPeople.chartSel
    .selectAll(".nodes")
    .on("mouseover", (d,i) => {
      showTip(d,"nodes");
    })
    .on("mouseout", (d,i) => {
      hideTip();
    })
    .on("click", (d,i) => {

      //check if any other image & big radius is present - different from the one clicked => if yes delete them
      let target = d3.select(d3.event.target)
      console.log("target",target);

      let oldOnes = forceData.filter( (e) => {
        return (e.r == bigR) && (e.id != d.id);
      });

      if ( oldOnes.length != 0 ){
        console.log("odOnes", oldOnes);

        let oldNodeSelect = chartPeople.chartSel
          .selectAll(".nodes")
          .filter( (n) => {
            return n.id == oldOnes[0].id ;
          });

        console.log("oldNodeSelect",oldNodeSelect);
        updateRadius(oldNodeSelect, simulation, forceData);
        offRectangles();
        deleteImg();
      }

      // light on the rectangles
      categoriesAttribute.forEach( (cat,i) => {
        let category = d[cat];
        d3.select("." + getClassItem(category))
          .transition()
          .duration(delayLegend)
            .style("fill", categoriesList[i].color);
      });

      // update Radius of clicked node
      updateRadius(target, simulation, forceData);

      // check in any case if the image is still there and delete it (because of the over)
      if (d.r == bigR) {
        deleteImg();
        offRectangles();
      }
      else {
        // add img when node position is stabilized
        setTimeout(function() {
          addImage(target, simulation, forceData);
        }, timerAddImg);
      }


      //updateRadius(target, simulationPeople, forceDataPeople);


    });

}

function updateRadius(targetSelection, simulation, forceData){

  //console.log("people-steps - updateRadius - targetSelection",targetSelection);
  targetSelection
    .transition()
    .ease(d3.easePolyInOut)
  	.duration(bigNodeDuration + 100)
    .style("fill", (d) => {
      if (d.r == radius) { return colorBigNode;}
      else { return getNodeColor(d.img);}
    })
    .tween('radius', (d) =>	{

      let rEnd;
      let initR = d.r;
      // if small go big
      if (d.r == radius) { rEnd = bigR;}
      // if big go small and delete image
      else {
        rEnd = radius;
        //d3.selectAll("image").remove();

        //light off the rect
        d3.selectAll(".rectCategory")
          .style("fill", rectColor);
      }

      let it = d3.interpolate(d.r, rEnd);
      //console.log("people-steps - updateRadius - d.r",d);
      //console.log("people-steps - updateRadius - rEnd",rEnd);

      return function(t) {
        //console.log(it(t));
      	d.r = it(t);
      	targetSelection.attr('r', (datum) => {return datum.r;});

        restartCollide(simulation, 0.2);
        //if (initR != radius){
          simulation.alpha(0.1).restart();
        //}
      }
    });
}

function addImage(targetSelection, simulation, forceData){

  console.log("people-steps - generateCategoryStats - addImage");

  const datum = targetSelection.datum();

  console.log("people-steps - generateCategoryStats - addImage - datum.img", imgPath + datum.img);

  //console.log(datum);
  const position = [datum.x,datum.y];
  //console.log(position);

  // with circlePath corresponding to the nodes size
  let defs = chartPeople.chartSel
    .append('clipPath')
    .attr('id',`clip-circle`)
    .append("circle")
      .attr('id',`clip-circle-img`)
      .attr("r", 0)
      .attr("cy", bigR)
      .attr("cx", bigR)
      .transition()
        .ease(d3.easePolyInOut)
        .duration(500)
        .attr("r", bigR)

  // with rounded image
  chartPeople.chartSel
    .append("image")
    .attr("id","img-node")
    .attr("class","image")
    //.attr("xlink:href", d.img)
    .attr("xlink:href", imgPath + datum.img)
    .attr("clip-path", `url(#clip-circle`)
    .attr("height", bigR * 2 )
    .attr("width", bigR * 2 )
    .attr("transform","scale(2)")
    .attr("transform", "translate(" + (position[0]-bigR) + "," + (position[1]-bigR) +")" )
    .on("mouseover", (d,i) => {
      showTip(datum,"nodes");
    })
    .on("mouseout", (d,i) => {
      hideTip();
    })
    .on("click", () => {

      offRectangles();

      //updateRadius(domNode);
      updateRadius(targetSelection, simulation, forceData);

      deleteImg();

    })
}

function deleteImg(){
  d3.select("#clip-circle-img")
  .transition()
    .ease(d3.easePolyInOut)
    .duration(500)
    .attr("r", 0);

  d3.selectAll("#clip-circle").remove();
  d3.selectAll("#img-node").remove();
}

function offRectangles(){
  //light off the rect
  d3.selectAll(".rectCategory")
    .transition()
    .duration(delayLegend)
      .style("fill", rectColor);
}

function highlightNodes(id, actionType, simulation, forceData){

  let node = chartPeople.chartSel
    .selectAll(".nodes")
    .filter( (d) => { return d.id == id });
  //console.log(node);

  updateRadius(node, simulation, forceData);

  if (actionType == "on"){
    setTimeout(function() {
      addImage(node, simulation, forceData);
    }, timerAddImg);

  }
  else {
    deleteImg();
  }
}

export {
  updateNodesClusterCenter, updateNodesClusterCenterCategory, generateCategoryStats, drawRectLayout, showStep, addNodesOnClick, highlightNodes, unshowAllLegend, updateNodeColor
}
