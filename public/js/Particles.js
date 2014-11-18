function Particles(owner) {
    this.owner = owner;
    this.numParticles = 15;
    this.particleLifetime = 25;
    this.colour1 = '255, 102, 0';
    this.colour2 = '230, 0, 0';
    this.particleSetup();
}

	
Particles.prototype.particles=[];

Particles.prototype.particleSetup=function(){
    
  for(var i=0; i<this.numParticles; ++i){

    this.particles.push(new Particle(this.particleLifetime*i/this.numParticles, this.owner));
    }
};

Particles.prototype.render = function(ctx){
    var curCol;
    
    if(!this.owner.isLanded && scoreManager.fuel > 0){
    	for(var i = 0; i< this.numParticles; i++){
            if(i%2 === 0 || i>6){
            curCol = this.colour1;
            }
            else{
                curCol = this.colour2;
            }
    		this.particles[i].render(ctx, this.numParticles, curCol);
    	}
    }
};

Particles.prototype.update = function(du){

    for(var i = 0; i< this.numParticles; i++){
        this.particles[i].update(this.particleLifetime,du);
    }

};  

Particles.prototype.landed = function() {

};