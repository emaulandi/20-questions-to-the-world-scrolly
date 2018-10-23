import { updateForce } from './forceUtils';
import { forcePropsCluster, alpha, chartPeople, genderCategory, ageCategory, occupationCategory, yNodes, alphaPeople } from './constants';



function generateClusterPositionHorizontal(svgProps,topicsNumber){
	let clusterPosition = [];
  let i ;

  if (topicsNumber <= 6){
    for(i=0;i<topicsNumber;i++){
  		clusterPosition.push({x: (i+1)*svgProps.width/(topicsNumber+1), y: yNodes});
  	}
  }
  // create clusters on 2 two levels above 6 items in a category
  else{

    const reference = topicsNumber/2 ;
    //console.log("people-steps -- generateClusterPositionHorizontal - reference",reference);
    //console.log("people-steps -- generateClusterPositionHorizontal - topicsNumber",topicsNumber);

    for(i=0;i<topicsNumber;i++){
      if (i < reference ) {
  		  clusterPosition.push({x: (i+1)*svgProps.width/(reference+1), y: 2*yNodes/3});
      }
      else{
        clusterPosition.push({x: (i%(Math.round(reference))+1)*svgProps.width/reference, y: yNodes + yNodes/3});
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
	simulation.alpha(alpha).restart();
}

function updateNodesClusterCenterCategory(simulation, svgProps, data, category, categoryName){

	const position = generateClusterPositionHorizontal(svgProps, category.length);

	//console.log(" people-steps - updateNodesClusterCenterCategory - position", position) ;

	data.forEach( (d,i) => {
		d.centerX = position[category.indexOf(d[categoryName])].x;
		d.centerY = position[category.indexOf(d[categoryName])].y;
	});

	updateForce(simulation, forcePropsCluster);
	simulation.alpha(alphaPeople).restart();
}

export {
  updateNodesClusterCenter, updateNodesClusterCenterCategory
}
