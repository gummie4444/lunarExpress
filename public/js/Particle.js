function Particle(life, owner)
{
  this.owner = owner;
  this.respawn(life);
}

Particle.prototype.respawn = function(life)
{ 
  var dX = -Math.sin(this.owner.rotation);
  var dY = +Math.cos(this.owner.rotation);

  var oVelX = this.owner.getVel().velX;
  var oVelY = this.owner.getVel().velY;
  var oPosX = this.owner.getPos().posX;
  var oPosY = this.owner.getPos().posY;

  var vecVelsqr = util.square(oVelX) + util.square(oVelY);

  var maxVel = this.owner.maxVel;


  var relVel = vecVelsqr/util.square(maxVel);
  var launchDist = 16.5;

  var relVelX,relVelY;

  if(keys[this.owner.KEY_THRUST]){
    relVelX = dX;
    relVelY = dY;
  }
  else{
    relVelX = 0;
    relVelY = 0;
  }

  var random = util.randRange(1, 2);
  this.cx = (oPosX +dX*launchDist);
  this.cy = (oPosY +dY*launchDist);

  this.vx = (oVelX + relVelX)*random;
  this.vy = (oVelY + relVelY)*random;

  
  this.life = life;

  this.radius = 5;

}

Particle.prototype.render=function(ctx, numParticles, colour)
{
  if(gameManager.currentScreen === 0){
    for(var i = 0; i< numParticles; i++){
      ctx.save();
      ctx.fillStyle =  'rgba(' + colour +', '+this.alpha+ ')';
      util.fillCircle(ctx, this.cx, this.cy, this.radius);
      ctx.restore();
    }
  }

  
}

Particle.prototype.update = function(particleLifetime, du)
{
  if(gameManager.currentScreen === 0){
    var damping = 0.995;
    this.vx *= damping;
    this.vy *= damping;

    this.cx += this.vx;
    this.cy += this.vy;
    this.radius *= 0.95;

    this.life -= 1;
    if (this.life <= 0) this.respawn(particleLifetime);

    this.alpha=this.life/particleLifetime;
  }
}