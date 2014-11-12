/*
 A single explosion particle
*/
function ExplosionParticle ()
{
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.colour = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;
}

ExplosionParticle.prototype.update = function(du)
{	
	//console.log("update");
	// shrinking
	this.scale -= this.scaleSpeed * du/100.0;

	if (this.scale <= 0)
	{
		return entityManager.KILL_ME_NOW
		//this.scale = 0;
	}
	// moving away from explosion center
	this.x += this.velocityX * du/100.0;
	this.y += this.velocityY * du/100.0;
};

ExplosionParticle.prototype.render = function(ctx)
{	//console.log("render");
	// translating the context to the particle coordinates
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(this.scale, this.scale);

	// drawing a filled circle in the particle's local space
	ctx.fillStyle = this.colour;
	util.fillCircle(ctx, 0, 0, this.radius);
	ctx.restore();
};





function Explosion(x, y, colour){
	this.createExplosion(x, y, colour);
	this.explode.play();
}

Explosion.prototype.explode = new Audio(
    "sounds/hitexplosion.wav");

Explosion.prototype.createExplosion = function(x, y, colour)
{
	this.minSize = 10;
	this.maxSize = 30;
	this.count = 10;
	this.minSpeed = 60.0;
	this.maxSpeed = 200.0;
	this.minScaleSpeed = 1.0;
	this.maxScaleSpeed = 4.0;
	this.particles = [];

	for (var angle=0; angle<360; angle += Math.round(360/this.count))
	{
		var particle = new ExplosionParticle();

		particle.x = x;
		particle.y = y;

		particle.radius = util.randRange(this.minSize, this.maxSize);

		particle.colour = colour;

		particle.scaleSpeed = util.randRange(this.minScaleSpeed, this.maxScaleSpeed);

		var speed = util.randRange(this.minSpeed, this.maxSpeed);

		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		this.particles.push(particle);
	}
}

Explosion.prototype.update = function(du) {
	var death = [];
	var sum = 0.0;
	for(var i = 0; i< this.particles.length ; i++){
		x = this.particles[i].update(du);
		death.push(x);
		sum += x;
	}

	if(sum === -this.particles.length){
		return entityManager.KILL_ME_NOW;
	}

}

Explosion.prototype.render = function(ctx){

	for(var i = 0; i< this.particles.length; i++){
		this.particles[i].render(ctx);
	}
}