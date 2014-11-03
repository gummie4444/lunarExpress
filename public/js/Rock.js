// ====
// ROCK
// ====

"use strict";

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rock(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.randomisePosition();
    this.randomiseVelocity();
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.rock;
    this.scale  = this.scale  || 0.2;

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

Rock.prototype = new Entity();

Rock.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || util.randRange(50, g_canvas.height - 100);
    this.rotation = this.rotation || 0;
};

Rock.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 50,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;

    this.velX = speed;
};

Rock.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
        spatialManager.unregister(this);
    var hitEntity = this.findHitEntity();

    if(hitEntity)
    {
        if(hitEntity instanceof Ship)
        {
            hitEntity.warp();
        }
        else if (hitEntity instanceof Bullet)
        {
            this.takeBulletHit();
            hitEntity.kill();
        }
    }

    this.cx += this.velX * du;
    this.cy += (Math.sin(this.cx / 2.5)) * du;

    this.wrapPosition();

    spatialManager.register(this);
    if(this._isDeadNow){
        spatialManager.unregister(this);
        return entityManager.KILL_ME_NOW;
    } 

};

Rock.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

// HACKED-IN AUDIO (no preloading)
Rock.prototype.splitSound = new Audio(
  "sounds/rockSplit.ogg");
Rock.prototype.evaporateSound = new Audio(
  "sounds/rockEvaporate.ogg");

Rock.prototype.takeBulletHit = function () {
    this.kill();
};

Rock.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
