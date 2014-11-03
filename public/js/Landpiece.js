// ==========
// LANDPIECE STUFF
// ==========

// Constructor
// Constructs a new random surface piece with left edge at Xpos.
// It's index in entityManager's array is index. 
// Landscape is compromised of an array of landscape pieces.

function Landpiece(i,Xpos,width){
	this.index = i;
	this.Ypos = 800-Math.random()*50;
	this.Xpos = Xpos;
	this.width = width;
	
}

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

Landpiece.prototype.update = function (du) {
	
}