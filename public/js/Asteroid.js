function Asteroid(descr) {
	this.setup(descr);

	this.randomisePosition();
	this.randomiseVelocity();

	this.sprite = this.sprite || g_sprites.rock;
	this.scale = this.scale || 0.7;
}

Asteroid.prototype = new Entity();

Asteroid.prototype.randomisePosition = function () {
	this.cx = this.cx || util.randRange(150, g_canvas.width + 1100);
	this.cy = this.cy || -10;
	this.rotation = this.rotation || 0;
};

Asteroid.prototype.randomiseVelocity = function () {
	var MIN_SPEED = 350;
	var MAX_SPEED = 370;

	var xSpeed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
	var ySpeed = util.randRange(MIN_SPEED - MIN_SPEED/2/*/ 2*/, MAX_SPEED /*/ 2*/) / SECS_TO_NOMINALS;

	this.velX = xSpeed;
	this.velY = ySpeed;

	var MIN_ROT_SPEED = 1,
        MAX_ROT_SPEED = 3;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};

Asteroid.prototype.explode = function(){
    entityManager.generateExplosion(this.cx, this.cy, "#525252"); 
    entityManager.generateExplosion(this.cx, this.cy, "#FFA318");
};

Asteroid.prototype.update = function (du) {

	spatialManager.unregister(this);

	var hitEntity = this.findHitEntity();

    if(hitEntity) {
        if(hitEntity instanceof Ship) {
            hitEntity.explode();
            this.explode();
            if(!hitEntity.invulnerable){
                // The player takes a penalty to fuel if asteroids hit it.
                scoreManager.fuel -= scoreManager.otherExplode;
            }
            this.kill();
        }

        else if (hitEntity instanceof Bird) {
        	hitEntity.kill();
            
        }
    }

    if (this.cx < - 100 || this.cx > g_canvas.width + 1500) {
    	this.kill();
    } 

    var landingInfo = entityManager.landscape.doesCollide(this.cx, this.cy+this.getRadius(), this.getRadius());

    if(landingInfo.collide){
        this.explode();
        entityManager.landscape.destroy(this.cx,this.cy,this.getRadius());
        this.kill();
    }

    this.cx -= this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation, 0, consts.FULL_CIRCLE);

    spatialManager.register(this);

    if (this._isDeadNow) {
		spatialManager.unregister(this);
		return entityManager.KILL_ME_NOW;
    }

};

Asteroid.prototype.getRadius = function () {
	return this.scale * (this.sprite.width / 2) * 0.9;
};

Asteroid.prototype.spawnFragment = function () {
    entityManager.generateAsteroid({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /20
    });
};

Asteroid.prototype.render = function (ctx) {
	var origScale = this.sprite.scale;
	this.sprite.scale = this.scale;
	this.sprite.drawCentredAt(
		ctx, this.cx, this.cy, this.rotation
	);
};