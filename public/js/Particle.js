function Particle(life, owner)
{
  this.owner = owner;
  this.respawn(life);
}

Particle.prototype.respawn = function(life)
{ //var ownerpos = this.owner.getPos();
  var dX = -Math.sin(this.owner.rotation);
  var dY = +Math.cos(this.owner.rotation);

  var oVelX = this.owner.getVel().velX;
  var oVelY = this.owner.getVel().velY;
  var oPosX = this.owner.getPos().posX;
  var oPosY = this.owner.getPos().posY;

  var vecVelsqr = util.square(oVelX) + util.square(oVelY);

  var maxVel = 1.0;


  var relVel = vecVelsqr/util.square(maxVel);



  var launchDist = 16.5;

  var relVelX,relVelY;

  if(keys[this.owner.KEY_THRUST] && relVel <= 1){
    relVelX = dX /** relVel*/;
    relVelY = dY /** relVel*/;
  }
  else{
    relVelX = 0;//dX;
    relVelY = 0;//dY;
  }

  var random = util.randRange(1, 2);
  this.cx = (oPosX +dX*launchDist);
  this.cy = (oPosY +dY*launchDist);

  this.vx = (oVelX + relVelX)*random;
  this.vy = (oVelY + relVelY)*random;

  //this.cx = (this.owner.getPos().posX + Math.random()*0.5);
  //this.cy = (this.owner.getPos().posY + Math.random()*0.5);

  //this.vy = this.owner.velX;//*Math.random()*0.2;
  //this.vx = this.owner.velY;//*Math.random()*0.2;

  //console.log("x: "+this.cx,"y: "+this.cy);
  this.life = life;

  this.radius = 5;

}


/*
if (keys[this.KEY_THRUST]) {
        thrust += NOMINAL_THRUST;
        
    }

var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);

*/

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
  this.radius *= 0.95;

  //skoða þetta :
  this.life-=1;
  if (this.life<=0) this.respawn(particleLifetime);

  this.alpha=this.life/particleLifetime;
}