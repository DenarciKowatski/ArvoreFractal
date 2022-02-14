var createTree = function(){
	
	"use strict";

	var draw = (function(){ 
		
		var c = document.getElementById("tree").getContext("2d");
		var canvasWidth = 500;
		var canvasHeight = 600;
		var extent = 3.5; //arbitrary x scale
		var nGen = 4;
	
		return function(multi, r, theta){
			
			var xScale = (function(){
				var xRange = extent;
				var width = canvasWidth;
				var c = width/2;
				var m = width/xRange;
				
				return function(val){
					return Math.round(m*val + c);	
				};
				
			})();
			
			var yScale = (function(){
				var height = canvasHeight;
				var width = canvasWidth;
				var aspect = width/height;
				var yRange = extent/aspect;
				var m = -height/yRange;
				var c = -(m*extent);
				
				return function(val){
					return Math.round(m*val + c);	
				};
					
			})();
			
			var branchAngles = [];
			
			(function(){
				var branchSep = (2*theta)/(multi-1);
				for(var i=0; i<multi; i++){
					branchAngles.push(-theta + i*branchSep);	
				}
			})();
			
			c.clearRect(0, 0, canvasWidth, canvasHeight);
			c.beginPath();
			c.strokeStyle = "rgb(123,46,0)";
			var xInit = 0;
			var yInit = 1;
			var rotInit = 0;
			
			var thisGen = [{xEnd:xInit, yEnd:yInit, rot:rotInit}];
			c.moveTo(xScale(0), yScale(0));
			c.lineTo(xScale(xInit), yScale(yInit));
			var changedCol = false;
			
			for(var i=0; i<nGen; i++){
				
				var lastGen = thisGen;
				var nLastGen = lastGen.length;
				thisGen = [];
				thisGen.length = multi*nLastGen;
				
				var notLastGen = i<(nGen-1) ? true : false;
				
				var	len = Math.pow(r, i+1);
				
				if(!changedCol && i>2){
					changedCol = true;
					c.stroke();
					c.beginPath();
					c.strokeStyle = "#308014";//"green";
				}
				
				
				for(var j=0; j<nLastGen; j++){
					
					var parent = lastGen[j];
					var xStart = parent.xEnd;
					var yStart = parent.yEnd;
					var rotParent = parent.rot;
					
					for(var k=0; k<multi; k++){
						var rot = rotParent + branchAngles[k];
						var xEnd = xStart + len*Math.sin(rot);
						var yEnd = yStart + len*Math.cos(rot);
						
						c.moveTo(xScale(xStart), yScale(yStart));
						c.lineTo(xScale(xEnd), yScale(yEnd));
						
						if(notLastGen){
							thisGen[j*multi+k] = {
								xEnd: xEnd,
								yEnd: yEnd,
								rot: rot
							};
						}
					}
					
				}
				
			}
			
			c.stroke();
			
			
		};
	
	})();
	
	var multiplicity;
 	var ratio;
	
	//set multiplicity and ratio
	(function(){
		var select =  document.getElementById("tree-multi");
		var setMultiplicity = function(){multiplicity = parseInt(select.value, 10);};
		select.addEventListener("change", function(){setMultiplicity();});
		setMultiplicity();
		
		var slider = document.getElementById("tree-ratio");
		var setRatio = function(){ratio = parseFloat(slider.value);};
		slider.addEventListener("input", function(){setRatio();});
		setRatio();
	})();
	


	var animationStartTime;
	var requestId;

	
	var startAnimation = function(){
		animationStartTime = window.performance.now();
		requestId = window.requestAnimationFrame(animate);
	};
	
	var animate = function animate(time){
    	requestId = window.requestAnimationFrame(animate);
		var timeDifference = time - animationStartTime;
		var angleDeg = timeDifference/25;
		var angle = angleDeg*(Math.PI/180);
		draw(multiplicity, ratio, angle);
	};
	
	var stopAnimation = function(){
		if(requestId){
			window.cancelAnimationFrame(requestId);
		}
		requestId = undefined;
	};
	

	return Object.freeze({
		startAnimation: function(){startAnimation(); return this;},
		stopAnimation: function(){stopAnimation(); return this;},
	});
	
	
};

var tree = createTree();
tree.startAnimation();