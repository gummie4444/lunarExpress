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
    this.thrusterSound.loop = true;
    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 0.5;
    this._isWarping = false;
    this._isControllable = true;

};

Ship.prototype = new Entity();

Ship.prototype.thrusterSound = new Audio("sounds/rocketthruster.wav");

Ship.prototype.thrusterSound.addEventListener('timeupdate', function() {

    var buffer = .64;
    if(this.currentTime > this.duration - buffer){
        this.currentTime = 0
        this.play()
    }

}, false);

Ship.prototype.sound = function() {
        if (g_soundOn) {
            this.thrusterSound.loop = true;
            this.thrusterSound.play();
        } else {
            this.thrusterSound.pause();
        }
}

Ship.prototype.particleSetup = function(){
    this.particles = new Particles(this);
};

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST = '38';
Ship.prototype.KEY_RETRO  = '40';
Ship.prototype.KEY_LEFT   = '37';
Ship.prototype.KEY_RIGHT  = '39';

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
Ship.prototype.invulnerable = true;
Ship.prototype.invulnTimer = 0;
Ship.prototype.landTimer = 0;
Ship.prototype.isLanded = false;
Ship.prototype.thrusterSound.volume = 0;

Ship.prototype.explode = function(){
    this.thrusterSound.pause();
    entityManager.generateExplosion(this.cx, this.cy, "#525252"); 
    entityManager.generateExplosion(this.cx, this.cy, "#FFA318");
};

Ship.prototype.update = function (du) {

    if(gameManager.currentScreen === 0 ){
        this.invulnTimer += du*NOMINAL_UPDATE_INTERVAL;
    }
    if(this.invulnTimer > 3000) this.invulnerable = false;

    this.landTimer += du*NOMINAL_UPDATE_INTERVAL;
    if(this.landTimer >0 && this.isLanded) this.reset();

    if(gameManager.currentScreen === 0){
        
            scoreManager.verS = this.velY;
            scoreManager.horS = this.velX;
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

                    if(hitEntity instanceof Bird || hitEntity instanceof Asteroid)
                    {
                        if(!this.invulnerable){
                            this.explode();
                            this.invulnTimer = 0;
                            scoreManager.fuel -= scoreManager.otherExplode;
                            hitEntity.kill();

                            // Check for game over.
                            if(scoreManager.fuel <= 0){
                                scoreManager.currentScreen = scoreManager.finishScreen;
                            }

                            this.reset();
                        }
                    }
                }
                
                this.maybeLand();

                // Perform movement substeps
                var steps = this.numSubSteps;
                var dStep = du / steps;
                for (var i = 0; i < steps; ++i) {
                    this.computeSubStep(dStep);
                }
               
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

        var currentVel = (this.velY+this.velX)/2;
        // Lose fuel upon crash with landscape.
        scoreManager.fuel -= scoreManager.landScapeExplode * currentVel;


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

        currentVel = (this.velY+this.velX)/2;
        scoreManager.fuel -= scoreManager.landScapeExplode * currentVel;

        this.reset();   
    }

};

Ship.prototype.land = function(){
    this.isLanded = true;

    scoreManager.score += 100+scoreManager.timeBonus();
    this.landTimer = -2000;
    this.halt();
    this._isControllable= false;
    this.thrusterSound.volume = 0;
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
};

var NOMINAL_THRUST = +0.0045;
var NOMINAL_RETRO  = -0.0005;
var thrusterSoundIncrement = 0.025;
var thrusterSoundDecrement = 0.07;

Ship.prototype.computeThrustMag = function () {
    
    var thrust = 0;

     if(scoreManager.fuel > 0){
        if (keys[this.KEY_THRUST]) {
            thrust += NOMINAL_THRUST;
            scoreManager.fuel -= 0.1;
            this.cx += util.randRange(-0.5,0.5)
            this.cy += util.randRange(-0.5,0.5)
            
            if (this.thrusterSound.volume < 0.9) {
                this.thrusterSound.volume += thrusterSoundIncrement
            }
        } else {
            if (this.thrusterSound.volume > 0.11) {
                this.thrusterSound.volume -= thrusterSoundDecrement;
            } else {
                this.thrusterSound.volume = 0;
            }
        }
    }
    
    
    return thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {

    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du; 

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;


    g_moveBackground_x =intervalVelX/8;
    g_moveBackground_y =intervalVelY/8;
    
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
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Ship.prototype.getRadius = function () {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    var x = (this.sprite.getScaledWidth() / 2) * 0.9;
    this.sprite.scale = origScale;
    return x;
};

Ship.prototype.getVel = function() {
    return {velX : this.velX, velY : this.velY};
};

Ship.prototype.reset = function () {
    if(scoreManager.fuel <= 0){
            scoreManager.fuel = 200;
            gameManager.currentScreen = gameManager.finishScreen;
    }
    this.invulnTimer = 0;
    this.invulnerable = true;
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this._isControllable = true;
    this.isLanded = false;
    
    this.velX = 0.4;
    this.velY = 0.1;

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
    var over = this.cy - this.getRadius();
    var drawy;
    if(over < 0){
        this.sprite.scale = this._scale;
        this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
        );
        this.sprite.scale = origScale; 
    }
    else{
        this.sprite.scale = this._scale;
        this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
        );
        this.sprite.scale = origScale;
    }
    if(this.invulnerable){
        var oldStyle = ctx.fillStyle;
        ctx.globalAlpha = 0.5;
        var grd = ctx.createRadialGradient(this.cx, this.cy, 5, this.cx, this.cy, this.getRadius()*2);
        grd.addColorStop(0, "cyan");
        grd.addColorStop(1, "blue");
        ctx.fillStyle = grd;
        util.fillCircle(ctx, this.cx, this.cy, 2*this.getRadius());
        ctx.fillStyle = oldStyle;
        ctx.globalAlpha = 1.0;
    }
    this.particles.render(ctx);
};
