// ==========
// LANDPIECE STUFF
// ==========

// Constructor
// Constructs a new random surface piece with left edge at cx.
// It's index in entityManager's array is index. 
// Landscape is compromised of an array of landscape pieces.

function Landpiece(i,Xpos,width,landable){
	this.index = i;
	this.Ypos = 800-Math.random()*50;
	this.Xpos= Xpos;
	this.cx = width/2 + Xpos;
	this.cy = this.Ypos;
	this.width = width;
	this.landable = landable;
	this.setup();
	
}

Landpiece.prototype = new Entity();

Landpiece.prototype.render = function (ctx) {
	var oldStyle = ctx.strokeStyle;
	ctx.strokeStyle = "cyan";

	var Xoffset = 0;
	var Xdrawloc = this.Xpos + Xoffset;
	while( Xdrawloc < g_canvas.width ){
		util.drawHorizontalLine(ctx, Xdrawloc, Xdrawloc+this.width, this.Ypos);
		Xdrawloc += 896;
	}
	ctx.strokeStyle = oldStyle;
	
}

Landpiece.prototype.getRadius = function () {
	return this.width/2;
}

Landpiece.prototype.getWidth = function () {
	return this.width;
}

Landpiece.prototype.update = function (du) {

	spatialManager.unregister(this);
	//Somethin

	spatialManager.register(this);
	
}