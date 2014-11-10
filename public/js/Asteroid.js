function Asteroid(descr) {
	this.setup(descr);

	this.randomisePosition();
	this.randomiseVelocity();

	this.sprite = this.sprite || g_sprites.rock;
	this.scale = this.scale || 0.7;
}

Asteroid.prototype = new Entity();

Asteroid.prototype.randomisePosition = function () {
	this.cx = this.cx || Math.random() * g_canvas.width;
	this.cy = this.cy || util.randRange(50, g_canvas.height - 300);
	this.rotation = this.rotation || 0;
};

Asteroid.prototype.randomiseVelocity = function () {
	var MIN_SPEED = 350;
	var MAX_SPEED = 370;

	var xSpeed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
	var ySpeed = util.randRange(MIN_SPEED / 3, MAX_SPEED / 3) / SECS_TO_NOMINALS;

	this.velX = xSpeed;
	this.velY = ySpeed;

	var MIN_ROT_SPEED = 1,
        MAX_ROT_SPEED = 3;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};

Asteroid.prototype.update = function (du) {

	spatialManager.unregister(this);

	var hitEntity = this.findHitEntity();

    if(hitEntity) {
        if(hitEntity instanceof Ship) {
            hitEntity.warp();
        }
        else if (hitEntity instanceof Bullet) {
            this.takeBulletHit();
            hitEntity.kill();
        } else if (hitEntity instanceof Landscape) {
			this.kill();
        }
    }

    this.cx -= this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation, 0, consts.FULL_CIRCLE);

    this.wrapPosition();

    spatialManager.register(this);

    if (this._isDeadNow) {
		spatialManager.unregister(this);
		return entityManager.KILL_ME_NOW;
    }

};

Asteroid.prototype.getRadius = function () {
	return this.scale * (this.sprite.width / 2) * 0.9;
};

Asteroid.prototype.takeBulletHit = function () {
	this.kill();
};

Asteroid.prototype.render = function (ctx) {
	var origScale = this.sprite.scale;
	this.sprite.scale = this.scale;
	this.sprite.drawWrappedCentredAt(
		ctx, this.cx, this.cy, this.rotation
	);
};