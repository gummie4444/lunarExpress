// ==========
// LANDSCAPE
// ==========

// Landscape objects are the pieces of which the landscape in the game is
// compromised. 

// Generates a new piece of land based on existing land to the left.

var currentLevel = 0;

function Landscape() {
	// landscape is comprised of an array of heights.
	this.array = [];

	// Earth
	if (currentLevel === 2) {
		this.pieceWidth = 8;
		this.heightVariation = 40;
		this.color = "#5FD102";
	} 

	// Mars
	if (currentLevel === 1) {
		this.pieceWidth = 16;
		this.heightVariation = 30;
		this.color = "#FF1E00";
	}

	// Moon
	if (currentLevel === 0) {
		this.pieceWidth = 16;
		this.heightVariation = 16;
		this.color = "#999999";
	}

	this.setup();
}

Landscape.prototype.setup = function () {
	var pieceCount = g_gameWidth / this.pieceWidth;

	var initialHeight = util.randRange(30,200);
	this.array[0] = initialHeight;
	var counter=0;
	var platformLimit = 3;
	var platformChance = 1 - ((this.pieceWidth * 0.01) / 2);

	for(var i = 1; i < pieceCount; i++){
		var prevHeight = this.array[i-1];

		if(Math.random() > platformChance && counter === 0 && platformLimit != 0){
			counter = 64 / this.pieceWidth;
			platformLimit--;
		}

		if( counter > 0){
			this.array[i] = prevHeight;
			counter--;
		} else {
			if (prevHeight <= 50){
				this.array[i] = prevHeight + util.randRange(this.heightVariation/4,this.heightVariation);
			} else if (prevHeight >= 500){
				this.array[i] = prevHeight - util.randRange(this.heightVariation/4,this.heightVariation);
			} else {
				if (prevHeight - this.array[i-2] > 0) {
					this.array[i] = prevHeight + util.randRange(-this.heightVariation/12, this.heightVariation - prevHeight * 0.06);
				} else if (prevHeight - this.array[i-2] < 0) {
					this.array[i] = prevHeight + util.randRange(-this.heightVariation + prevHeight * 0.06, this.heightVariation/12);
				} else {
					this.array[i] = prevHeight + util.randRange(-this.heightVariation, this.heightVariation);
				}
				
			}		
		}
	}
}

Landscape.prototype.render = function (ctx) {
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = this.color;
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
	ctx.fill();
	
	ctx.fillStyle = oldStyle;
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
