/*
 A single explosion particle
*/
function ExplosionParticle ( type )
{
	if(type === undefined){
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.colour = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
	}
	else if(type === "big"){
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 140;
		this.colour = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
	}
	
}

ExplosionParticle.prototype.update = function(du)
{	
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
{	
	// translating the context to the particle coordinates
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(this.scale, this.scale);

	// drawing a filled circle in the particles local space
	ctx.fillStyle = this.colour;
	util.fillCircle(ctx, 0, 0, this.radius);
	ctx.restore();
};







function Explosion(x, y, colour, type){
	this.createExplosion(x, y, colour, type);
	if(g_soundOn){


		var aud = new Audio("sounds/hitexplosion.wav");
		aud.volume = 0.5;
		this.explode.volume = 0.5;
		this.explode2.volume = 0.5;
		if(this.explode.currentTime != 0){
			this.explode2.play();
		}
		else if(this.explode2.currentTime != 0){
			this.explode.play();
		}
		else{
			aud.play();
		}
	}
}

Explosion.prototype.explode = new Audio(
    "sounds/hitexplosion.wav");

Explosion.prototype.explode2 = new Audio(
	"sounds/hitexplosion.wav");

Explosion.prototype.createExplosion = function(x, y, colour, type)
{
	this.particles = [];
	if(type === undefined){
		this.minSize = 10;
		this.maxSize = 30;
		this.count = 10;
		this.minSpeed = 60.0;
		this.maxSpeed = 200.0;
		this.minScaleSpeed = 1.0;
		this.maxScaleSpeed = 4.0;
		
		
	}
	else if(type === "big"){
		this.minSize = 140;
		this.maxSize = 200;
		this.count = 10;
		this.minSpeed = 60.0;
		this.maxSpeed = 80.0;
		this.minScaleSpeed = 0.1;
		this.maxScaleSpeed = 0.5;
		
	}
	

	for (var angle=0; angle<360; angle += Math.round(360/this.count))
	{
		if(type === undefined){
			var particle = new ExplosionParticle();
		}
		else{
			var particle = new ExplosionParticle(type);
		}
		

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