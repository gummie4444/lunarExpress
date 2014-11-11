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

Landscape.prototype.setup = function () {
	var pieceCount = g_gameWidth / this.pieceWidth;
	var heightVariation = 30;

	var initialHeight = util.randRange(30,200);
	this.array[0] = initialHeight;
	var counter=0;

	for(var i = 1; i < pieceCount; i++){
		var prevHeight = this.array[i-1];

		if(Math.random() > 0.97 && counter === 0){
			counter = 20;
		}

		if( counter > 0){
			this.array[i] = prevHeight;
			counter--;
		}
		else{
			if(prevHeight <= 50){
				this.array[i] = prevHeight + util.randRange(heightVariation/4,heightVariation);
			}
			else if(prevHeight >= 500){
				this.array[i] = prevHeight - util.randRange(heightVariation/4,heightVariation);
			}
			else{
				this.array[i] = prevHeight + util.randRange(-heightVariation,heightVariation);
				}		
		}
	}
}

Landscape.prototype.getRandomColor =function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


Landscape.prototype.render = function (ctx) {
	var oldStyle = ctx.strokeStyle;
	ctx.strokeStyle = this.getRandomColor();

	ctx.beginPath();
	ctx.moveTo(0,g_canvas.height - this.array[0]);

	var xOffset = 0;
	while(xOffset < g_canvas.width){
		for(var i = 1; i<this.array.length; i++){

			var x = i*4+xOffset;
			var y = g_canvas.height - this.array[i];
			
			ctx.lineTo(x, y);
			
		}
		xOffset += g_gameWidth;
	}
	ctx.stroke();
	
	ctx.strokeStyle = oldStyle;
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