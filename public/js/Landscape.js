// ==========
// LANDSCAPE
// ==========

// Landscape objects are the pieces of which the landscape in the game is
// compromised. 

// Generates a new piece of land based on existing land to the left.
function Landscape(index){
	this.index = index;
	this.cx = 28+index*56;

	if(index < 1){
		this.cy = Math.random()*200;
		this.landable = true;
		return;
	}
	else{
		this.generateLand(this.index,this.cx);
	}
}

Landscape.prototype = new Entity();
Landscape.prototype.radius = 28; 
Landscape.prototype.landable = false;
Landscape.prototype._isDeadNow = false;

Landscape.prototype.generateLand = function (index,cx) {
	var leftLand = entityManager._landscape[index-1];
	var leftcy = leftLand.cy
	this.cy = leftcy + (Math.random()-0.5)*50;
	//Prevent height changes that are too small
	if(Math.abs(this.cy-leftcy)<4){
		this.cy = leftcy;
	}
	this.landable = true;
}

Landscape.prototype.render = function (ctx) {
	var oldStyle = ctx.strokeStyle;
	ctx.strokeStyle = "cyan";

	var Xoffset = 0;
	var Xdrawloc = this.cx + Xoffset;
	while( Xdrawloc < g_canvas.width+0.5*this.radius ){
		util.drawHorizontalLine(ctx, Xdrawloc-this.radius, Xdrawloc+this.radius, g_canvas.height-this.cy);
		Xdrawloc += 896;
	}
	ctx.strokeStyle = oldStyle;
}

Landscape.prototype.update = function (du) {}

Landscape.prototype.getRadius = function() {
	return this.radius;
}

Landscape.prototype.getPos = function() {
	return {posX : this.cx, posY : this.cy};
}