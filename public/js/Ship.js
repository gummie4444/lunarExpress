// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/



// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.particleSetup();
    this.hover1.loop = true;
    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 0.5;
    this._isWarping = false;
    this._isControllable = true;

    /*this.particles = new Particles({
    numParticles:15,
    particleLifetime:30,
    colour : '255, 102, 0'}, 
    this);*/
};

Ship.prototype = new Entity();

Ship.prototype.isLanded = false;

Ship.prototype.hover1 = new Audio(
    "sounds/export.wav");

Ship.prototype.hover2 = new Audio(
    "sounds/export.wav");


Ship.prototype.sound = function() {
    /*if(this.hover1.currentTime != 0){
        this.hover2.play();
    }*/
    /*else{
        this.hover1.play();
    }*/
    //this.hover1.loop = true;
    //this.hover1.play();
}
//Ship.prototype.particles = new Particles(this);

Ship.prototype.particleSetup = function(){
    this.particles = new Particles(this);
};

/*
Ship.prototype.particles = new Particles({
    numParticles:15,
    particleLifetime:30,
    colour : '255, 102, 0'} , 
    this);
*/
Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST = '38';//.charCodeAt(0);
Ship.prototype.KEY_RETRO  = '40';//.charCodeAt(0);
Ship.prototype.KEY_LEFT   = '37';//.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = '39';//.charCodeAt(0);

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = -Math.PI/2;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0.4;
Ship.prototype.velY = 0.1;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;
Ship.prototype.maxVel = 1.0;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");

Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -0.5;
    this.warpSound.play();
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 0.5;
        
    } else if (this._scale > 0.5) {
    
        this._scale = 0.5;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};

Ship.prototype.explode = function(){
    entityManager.generateExplosion(this.cx, this.cy, "#525252"); 
    entityManager.generateExplosion(this.cx, this.cy, "#FFA318");
};

Ship.prototype.update = function (du) {

    if(gameManager.currentScreen === 0){
            this.maxVel = 1.0*du;
            this.sound();
            
            if (this._isWarping) {
                this._updateWarp(du);
                return;
            }

            if(this._isControllable){

                spatialManager.unregister(this);
                var hitEntity = this.findHitEntity();


                if(hitEntity)
                {
                    if(hitEntity instanceof Ship)
                    {
                        this.explode();
                    }
                    else if (hitEntity instanceof Bullet)
                    {
                        this.takeBulletHit();
                        hitEntity.kill();
                    }
                    else if(hitEntity instanceof Bird || hitEntity instanceof Asteroid)
                    {
                        this.explode();
                        this.reset();
                    }
                }
                
                this.maybeLand();

                // Perform movement substeps
                var steps = this.numSubSteps;
                var dStep = du / steps;
                for (var i = 0; i < steps; ++i) {
                    this.computeSubStep(dStep);
                }

                // Handle firing
                this.maybeFireBullet();

               
                if (this._isDeadNow){
                    spatialManager.unregister(this);
                    return entityManager.KILL_ME_NOW;
                } 


            
                spatialManager.register(this);
                
        }
            this.particles.update(du);

       
    }
};


Ship.prototype.maybeLand = function(){
    var landingInfo = entityManager.landscape.doesCollide(this.cx,
                         this.cy+this.getRadius(), this.getRadius());

    if(!landingInfo.collide){
        return;
    }

    var landable = entityManager.landscape.landable(landingInfo.leftIndex, landingInfo.rightIndex);
    if(!landable){
        this.explode(); 
        entityManager.landscape.destroy(this.cx,this.cy,this.getRadius());
        this.reset();
        return;
    }
    
    var maxVel = 0.6;
    var landcy = g_canvas.height -entityManager.landscape.array[landingInfo.leftIndex];

    this.cy = landcy- this._scale * this.sprite.width/2;

    if(this.velY < maxVel && util.isBetween(this.rotation, 0.0-0.12,0.0+0.12 )){
        
        this.land();
    }
    else{
        this.explode();
        entityManager.landscape.destroy(this.cx,this.cy,this.getRadius());
        this.reset();   
    }

};

Ship.prototype.land = function(){
    this.isLanded = true;
    //g_useGravity = !g_useGravity;
    this.halt();
    this._isControllable = false;
    
}

Ship.prototype.computeSubStep = function (du) {
    
    var thrust = this.computeThrustMag();

    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;
    

    accelY += this.computeGravity();


    this.applyAccel(accelX, accelY, du);
    
    this.wrapPosition();
    
    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};

var NOMINAL_GRAVITY = 0.0015;

Ship.prototype.computeGravity = function () {

    if(g_useGravity && !this.isLanded){
        return NOMINAL_GRAVITY
    }
    return 0;
    //return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_THRUST = +0.0045;
var NOMINAL_RETRO  = -0.0005;

Ship.prototype.computeThrustMag = function () {
    
    var thrust = 0;
    
     if(scoreManager.fuel >= 0){
        if (keys[this.KEY_THRUST]) {
            thrust += NOMINAL_THRUST;
           
               scoreManager.fuel -= 0.1;
             
            
        }
    }
    /*if (keys[this.KEY_RETRO]) {
        thrust += NOMINAL_RETRO;
    }*/
    
    
    return thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {

    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    //if(util.square(this.maxVel)> (util.square(this.velX) + util.square(this.velY)) ){
    //if(this.velX<this.maxVel && this.velY < this.maxVel){
        this.velX += accelX * du;
        this.velY += accelY * du; 
    //}

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;

    //EGIJEORGHAERHGAO
    //TODO
    g_moveBackground_x =intervalVelX/4;
    g_moveBackground_y =intervalVelY/4;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    
    // bounce
    if (g_useGravity) {


    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
	var minY = g_sprites.ship.getScaledHeight() / 2;
    this.sprite.scale = origScale;
	var maxY = g_canvas.height - minY;

	// Ignore the bounce if the ship is already in
	// the "border zone" (to avoid trapping them there)
    	if (this.cy > maxY || this.cy < minY) {
    	    // do nothing
    	} 
        else if (nextY > maxY || nextY < minY) {
                this.velY = oldVelY * -0.9;
                intervalVelY = this.velY;
        }
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Ship.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);
           
    }
    
};

Ship.prototype.getRadius = function () {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    var x = (this.sprite.getScaledWidth() / 2) * 1.3;
    this.sprite.scale = origScale;
    return x;
};

Ship.prototype.getVel = function() {
    return {velX : this.velX, velY : this.velY};
};

Ship.prototype.takeBulletHit = function () {
    this.warp();
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this._isControllable = true;
    this.isLanded = false;
    /*if(!g_useGravity){
        g_useGravity = !g_useGravity;
    }*/
    this.velX = 0.4;
    this.velY = 0.1;
    //this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.04;

Ship.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
};

Ship.prototype.render = function (ctx) {
    
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;

    this.particles.render(ctx);
};
