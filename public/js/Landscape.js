// ==========
// LANDSCAPE
// ==========

// Landscape objects are the pieces of which the landscape in the game is
// compromised. 

// Generates a new piece of land based on existing land to the left.
function Landscape(){
	// landscape is compromised of an array of heights.
	this.array = [];
	this.pieceWidth = 4;
	this.setup();
}

var colors = {
	r : 150,
	g : 150,
	b : 150
};

Landscape.prototype.setup = function () {
	var pieceCount = g_gameWidth / this.pieceWidth;
	var heightVariation = 25;

	var initialHeight = util.randRange(30,200);
	this.array[0] = initialHeight;
	var counter=0;
	var platformLimit = 3;

	for(var i = 1; i < pieceCount; i++){
		var prevHeight = this.array[i-1];

		if(Math.random() > 0.98 && counter === 0 && platformLimit != 0){
			counter = 64 / this.pieceWidth;
			platformLimit--;
		}

		if( counter > 0){
			this.array[i] = prevHeight;
			counter--;
		} else {
			if (prevHeight <= 50){
				this.array[i] = prevHeight + util.randRange(heightVariation/4,heightVariation);
			} else if (prevHeight >= 500){
				this.array[i] = prevHeight - util.randRange(heightVariation/4,heightVariation);
			} else {
				if (prevHeight - this.array[i-2] > 0) {
					this.array[i] = prevHeight + util.randRange(-heightVariation/16, heightVariation - prevHeight * 0.03);
				} else if (prevHeight - this.array[i-2] < 0) {
					this.array[i] = prevHeight + util.randRange(-heightVariation + prevHeight * 0.03, heightVariation/16);
				} else {
					this.array[i] = prevHeight + util.randRange(-heightVariation, heightVariation);
				}
				
			}		
		}
	}
}

Landscape.prototype.changeColor = function (colors, du) {
	
	var colorVariation = 2;

	if (colors.r < 210) {
		colors.r += colorVariation / 3 * du;
	} else {
		colors.r = -209;
	}

	if (colors.g < 210) {
		colors.g += colorVariation / 2 * du;
	} else {
		colors.g = -209;
	}

	if (colors.b < 210) {
		colors.b += colorVariation * du;
	} else {
		colors.b = -209;
	}

	return colors;
}

Landscape.prototype.render = function (ctx) {
	var oldStyle = ctx.strokeStyle;
	var oldFillStyle = ctx.strokeStyle;
	var style = "rgba(" + Math.abs(Math.floor(colors.r)) + ", " + Math.abs(Math.floor(colors.g)) + ", " + Math.abs(Math.floor(colors.b)) + ", " + 1;
	ctx.strokeStyle = style;
	ctx.fillStyle = style;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0,g_canvas.height - this.array[0]);

	var xOffset = 0;
	while(xOffset < g_canvas.width){
		for(var i = 1; i<this.array.length; i++){

			var x = i*this.pieceWidth+xOffset;
			var y = g_canvas.height - this.array[i];
			
			ctx.lineTo(x, y);
			
		}
		xOffset += g_gameWidth;
	}

	ctx.lineTo(g_canvas.width, g_canvas.height);
	ctx.lineTo(0, g_canvas.height);
	// ctx.stroke();
	ctx.fill();
	
	ctx.strokeStyle = oldStyle;
	ctx.fillStyle = oldFillStyle;
}

Landscape.prototype.update = function (du) {
	this.changeColor(colors, du);
}

Landscape.prototype.doesCollide = function (cx,cy,radius) {
	while(cx > g_gameWidth){
		cx -= g_gameWidth;
	}

	var leftIndex = Math.floor((cx-radius)/this.pieceWidth);
	var rightIndex = Math.ceil((cx+radius)/this.pieceWidth);

	for(var i = leftIndex; i<=rightIndex; i++){
		if(cy > g_canvas.height-this.array[i]){
			return {
				collide: true,
				leftIndex: leftIndex,
				rightIndex: rightIndex
			};
		}
	}
	return {
				collide: false,
				leftIndex: leftIndex,
				rightIndex: rightIndex
		};
}

Landscape.prototype.landable = function(leftIndex, rightIndex){
	
	for(var i = leftIndex+1; i <= rightIndex; i++){
		var prevHeight = this.array[i-1];
		if(this.array[i] != prevHeight){
			return false;
		}
	}
	console.log("is landable");
	return true;
};
