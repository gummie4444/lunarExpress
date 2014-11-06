// ==========
// LANDSCAPE
// ==========

// Landscape objects are the pieces of which the landscape in the game is
// compromised. 

// Generates a new piece of land based on existing land to the left.
function Landscape(index){
	this.index = index;
	this.width = 56;
	this.cx = 28+index*56;

	if(index < 1){
		this.cy = g_canvas.height-Math.random()*200;
		this.landable = true;
		this.setup();
		return;
	}
	else{
		
		this.generateLand(this.index,this.cx);
	}
	console.log("lol")
	this.setup();
}

Landscape.prototype = new Entity();
Landscape.prototype.radius = 28; 
Landscape.prototype.landable = false;
//Landscape.prototype._isDeadNow = false;

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
		util.drawHorizontalLine(ctx, Xdrawloc-this.radius, Xdrawloc+this.radius,/* g_canvas.height-*/this.cy);
		Xdrawloc += 896;
	}
	/*this.cx = Xdrawloc;
	this.cy = g_canvas.height-this.cy;*/
	ctx.strokeStyle = oldStyle;
}

Landscape.prototype.update = function (du) {
	spatialManager.unregister(this);
	//Somethin

	spatialManager.register(this);

}

Landscape.prototype.getRadius = function() {
	return this.width/2;
}

Landscape.prototype.getWidth = function(){
	return this.width;
}

Landscape.prototype.getPos = function() {
	return {posX : this.cx, posY : this.cy};
}