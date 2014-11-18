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
		this.heightVariation = 20;
		this.color = "#999999";
	}


	this.platformLength = 64 / this.pieceWidth;
	this.minHeight = 50;
	this.maxHeight = 500;
	this.setup();
}

Landscape.prototype.setup = function () {

	resizeGame();
	var pieceCount = Math.ceil(g_canvas.width / this.pieceWidth);
	var initialHeight = util.randRange(30,200);
	this.array[0] = initialHeight;
	var counter=0;
	var platformLimit = 4;
	var platformChance = 1 - ((this.pieceWidth * 0.01) / 4);
	// var minPlatformDistance = 100 / this.pieceWidth;
	var maxPlatformDistance = 500 / this.pieceWidth;
	var platformDistance = 0;

	for(var i = 1; i < pieceCount; i++){
		var prevHeight = this.array[i-1];

		if(((Math.random() > platformChance && counter === 0) || platformDistance > maxPlatformDistance) && platformLimit != 0){
			counter = this.platformLength;
			platformLimit--;
			platformDistance = 0;
		}

		if( counter > 0){
			this.array[i] = prevHeight;
			counter--;
		} else {
			if (prevHeight <= this.minHeight){
				this.array[i] = prevHeight + util.randRange(this.heightVariation/4,this.heightVariation);
			} else if (prevHeight >= this.maxHeight){
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
		platformDistance++;
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

Landscape.prototype.destroy = function(cx,cy,radius){
	// radius is blast damage radius, not radius of entity colliding.
	// pieceRadius is blast radius in count of landpieces.
	var pieceRadius = Math.floor(radius / this.pieceWidth);
	// Blast radius (in pieceWidths) should not be smaller than platformLength.
	if(pieceRadius < this.platformLength){
		pieceRadius = this.platformLength;
		radius = pieceRadius * this.pieceWidth;
	}
	var pieceCx = Math.floor(cx/this.pieceWidth);
	
	for(var i = -pieceRadius+pieceCx; i < pieceRadius+pieceCx; i++){
		var y = g_canvas.height-this.array[i];
		var x = i*this.pieceWidth;
		var dist = Math.sqrt(util.distSq(x,y,cx,cy));
		if(dist < radius){		
			this.array[i] -= (radius - dist);
		}
		if(this.array[i] < this.minHeight){
			this.array[i] = this.minHeight;
		}
		
	}

};
