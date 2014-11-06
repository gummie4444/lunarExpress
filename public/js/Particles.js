function Particles(owner) {
    this.owner = owner;
    this.numParticles = 15;
    this.particleLifetime = 20;
    this.colour = '255, 102, 0';
    this.particleSetup();
}

/*Particles.prototype.print = function(){
    console.log(this.owner);

}*/
	
Particles.prototype.particles=[];
//(life, xVel, yVel, cx, cy, radius)

Particles.prototype.particleSetup=function(){
      for(var i=0; i<this.numParticles; ++i){
        //console.log(this.owner);
        this.particles.push(new Particle(this.particleLifetime*i/this.numParticles, this.owner));
     /*   this.particles.push(new Particle(this.particleLifetime*i/this.numParticles,
            this.owner.velX,
            this.owner.velY,
            this.owner.cx,
            this.owner.cy,
            this.owner.getRadius() )); */
        }
    };
    /*Particles.prototype.particleSetup=function(){
      for(var i=0; i<this.numParticles; ++i){
        this.particles.push(new Particle(this.particleLifetime*i/this.numParticles, this.owner);
        /*this.particles.push(new Particle(this.particleLifetime*i/this.numParticles,
            this.owner.velX,
            this.owner.velY,
            this.owner.cx,
            this.owner.cy,
            this.owner.getRadius() ));
    	}*/
    //};

    Particles.prototype.render = function(ctx){
    	for(var i = 0; i< this.numParticles; i++){
    		this.particles[i].render(ctx, this.numParticles, this.colour);
    	}
    };

    Particles.prototype.update = function(du){
        for(var i = 0; i< this.numParticles; i++){
            this.particles[i].update(this.particleLifetime,du);
        }
    	/*for(var i = 0; i< this.numParticles; i++){
    		this.particles[i].update(this.particleLifetime,
            this.owner.velX,
            this.owner.velY,
            this.owner.cx,
            this.owner.cy,
            this.owner.getRadius(),
            du);
    	}*/
   };  


//Particles for ship:
/*
var g_particlesball1 = new Particles({
    numParticles:15,
    particleLifetime:20,
    colour : '255, 102, 0'

});*/