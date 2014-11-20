// ==========
// LANDSCAPE
// ==========

// Landscape is an object that contains an array with height info.
// Platforms are then created with these heights and lines drawn between them
// The initial height is first randomly generated and landscape to 
// the right is generated from previous height values.

var g_currentLevel = 0;

function Landscape() {
	// landscape is comprised of an array of heights.
	this.array = [];

	// Earth
	if (g_currentLevel === 2) {
		this.pieceWidth = 8;
		this.heightVariation = 40;
		this.fillStyle = "#5FD102";
	} 

	// Mars
	if (g_currentLevel === 1) {
		this.pieceWidth = 16;
		this.heightVariation = 30;
		this.fillStyle = "#FF1E00";
	}

	// Moon
	if (g_currentLevel === 0) {
		this.pieceWidth = 16;
		this.heightVariation = 20;
		this.fillStyle = "#999999";
	}

	this.platformLength = 64 / this.pieceWidth;
	this.minHeight = 50;
	this.maxHeight = 500;
	this.trees = [];
	this.setup();
}

Landscape.prototype.setup = function () {
	//Check if window size has changed
	resizeGame();
	//Create landscape with width equal to window width.
	g_gameWidth = g_canvas.width;
	var pieceCount = Math.ceil(g_gameWidth / this.pieceWidth)+1;
	var initialHeight = util.randRange(50,250);

	this.array[0] = initialHeight;
	// counter is used to create landable platforms. When a platform
	// is randomly created, counter counts how many flat pieces are left.
	// When counter reaches zero, landpieces are generated randomly again.
	var counter=0;
	// platformLimit is max number of platforms.
	var platformLimit = 4;
	var platformChance = 1 - ((this.pieceWidth * 0.01) / 4);
	// If distance between platforms is greater than maxPlatformDistance, a platform is forced.
	var maxPlatformDistance = 500 / this.pieceWidth;
	var platformDistance = 0;

	// Iterate through array and intialise heights based on parameters above.
	for(var i = 1; i < pieceCount; i++){
		var prevHeight = this.array[i-1];

		// Create new platform
		if(((Math.random() > platformChance && counter === 0) || platformDistance > maxPlatformDistance) && platformLimit != 0){
			counter = this.platformLength;
			platformLimit--;
			platformDistance = 0;
		}

		// Continue current platform.
		if( counter > 0){
			this.array[i] = prevHeight;
			counter--;
		} else { // Else generate a random height.
			if (prevHeight <= this.minHeight){
				// Don't go below mininum height.
				this.array[i] = prevHeight + util.randRange(this.heightVariation/4,this.heightVariation);
			} else if (prevHeight >= this.maxHeight){
				// Don't go above max height.
				this.array[i] = prevHeight - util.randRange(this.heightVariation/4,this.heightVariation);
			} else { // If last height change was upwards, increased chance of upwards change again. 
					 // also, the higher the smaller the change.
				if (prevHeight - this.array[i-2] > 0) {
					this.array[i] = prevHeight + util.randRange(-this.heightVariation/12, this.heightVariation - prevHeight * 0.06);
				} else if (prevHeight - this.array[i-2] < 0) {
					// Same as before, but for downward height change.
					this.array[i] = prevHeight + util.randRange(-this.heightVariation + prevHeight * 0.06, this.heightVariation/12);
				} else { // If last height change was zero, generate random height.
					this.array[i] = prevHeight + util.randRange(-this.heightVariation, this.heightVariation);
				}
				
			}		
		}

		// Generate trees if this is earth.
		if (g_currentLevel === 2) {
			if (Math.random() > 0.75) {
				this.trees[i] = [1, util.randRange(0.6, 1.25)];
			}
		}

		platformDistance++;
	}
}

Landscape.prototype.render = function (ctx) {
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = this.fillStyle;
	var x = 0;
	// Height values of landscape are stored in distance from bottom, therefore drawing
	// height is g_canvas.height - current height value.
	var y = g_canvas.height - this.array[0];
	ctx.beginPath();
	ctx.moveTo(x,y);

	var xOffset = 0;
	// xOffset is used to wrap landscape if window is resized while game is playing.
	while(xOffset < g_canvas.width){
		for(var i = 1; i<this.array.length; i++){

			x = i*this.pieceWidth+xOffset;
			y = g_canvas.height - this.array[i];
			
			ctx.lineTo(x, y);

			if (this.trees[i]) {
				g_sprites.tree.scale = this.trees[i][1];
				g_sprites.tree.drawCentredAt(ctx, i * this.pieceWidth, g_canvas.height - this.array[i] - ((g_sprites.tree.height * this.trees[i][1]) / 2), 0);
			}
			
		}
		xOffset += g_gameWidth;
	}

	ctx.lineTo(g_canvas.width, g_canvas.height);
	ctx.lineTo(0, g_canvas.height);
	ctx.fill();

	if (g_currentLevel === 0) {
		// If on moon, render flag.
		g_sprites.flag.scale = 0.3;
		g_sprites.flag.drawCentredAt(ctx, 10 * this.pieceWidth, g_canvas.height - this.array[10] - g_sprites.flag.height / 2 * g_sprites.flag.scale + 5, 0);
	} 
	
	ctx.fillStyle = oldStyle;
}


Landscape.prototype.doesCollide = function (cx,cy,radius) {
	// Handle landscape wrapping for collisions.
	while(cx > g_gameWidth){
		cx -= g_gameWidth;
	}

	// Indices of height values relevant to collision check.
	var leftIndex = Math.floor((cx-radius)/this.pieceWidth);
	var rightIndex = Math.ceil((cx+radius)/this.pieceWidth);

	for(var i = leftIndex; i<=rightIndex; i++){
		if(cy > (g_canvas.height-this.array[i])){
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
	// Check if landscape between indices is flat.
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
		// Distance between center of collision and current piece of land.
		var dist = Math.sqrt(util.distSq(x,y,cx,cy));
		if(dist < radius){		
			this.array[i] -= (radius - dist);
		}
		if(this.array[i] < this.minHeight){
			this.array[i] = this.minHeight;
		}
		
	}

};
