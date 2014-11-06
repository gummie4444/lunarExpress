function Particle(life, owner)
{
  this.owner = owner;
  this.respawn(life);
}

Particle.prototype.respawn = function(life)
{ 
  this.cx = (this.owner.getPos.posX + Math.random()*0.5);
  this.cy = (this.owner.getPos.posY + Math.random()*0.5);
  this.vy = -this.owner.velX;//*Math.random()*0.2;
  this.vx = -this.owner.velY;//*Math.random()*0.2;

  this.life = life;

  this.radius = 50;

}

Particle.prototype.render=function(ctx, numParticles, colour)
{
  for(var i = 0; i< numParticles; i++){
    ctx.save();
    
    ctx.fillStyle =  'rgba(' + colour +', '+this.alpha+ ')';
    util.fillCircle(ctx, this.cx, this.cy, this.radius);

    ctx.restore();
  }

  
}

Particle.prototype.update = function(particleLifetime, du)
{
  
  var damping=0.995;
  this.vx*=damping*du;
  this.vy*=damping*du;

  this.cx+=this.vx;
  this.cy+=this.vy;
  this.radius *= 0.9;

  //skoða þetta :
  this.life-=1;
  if (this.life<=0) this.respawn(particleLifetime);

  this.alpha=this.life/particleLifetime;
}