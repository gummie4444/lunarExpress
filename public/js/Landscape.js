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
			counter = 10;
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

colors = {
	r : 150,
	g : 150,
	b : 150
};

Landscape.prototype.changeColor = function (colors) {
	
	var colorVariation = 8;

	if (colors.r < 210) {
		colors.r += colorVariation / 3;
	} else {
		colors.r = -209;
	}

	if (colors.g < 210) {
		colors.g += colorVariation / 2;
	} else {
		colors.g = -209;
	}

	if (colors.b < 210) {
		colors.b += colorVariation;
	} else {
		colors.b = -209;
	}

	return colors;
}


Landscape.prototype.render = function (ctx) {
	// var oldStyle = ctx.strokeStyle;
	var style = "rgba(" + Math.abs(Math.floor(colors.r)) + ", " + Math.abs(Math.floor(colors.g)) + ", " + Math.abs(Math.floor(colors.b)) + ", " + 1;
	ctx.strokeStyle = style;
	ctx.lineWidth = 2;
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
	
	// ctx.strokeStyle = oldStyle;

	colors = this.changeColor(colors);
}

Landscape.prototype.update = function (du) {
	
}