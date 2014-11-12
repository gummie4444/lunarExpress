function Bird(descr) {
	this.setup(descr);

	this.randomisePosition();
	this.randomiseVelocity();

	this.sprite = this.sprite || g_sprites.bird_up;
	this.scale = this.scale || 0.5;
    this.wingFlapDelay = 200;
    this.wingFlapTime = 0;
}

Bird.prototype = new Entity();

Bird.prototype.randomisePosition = function () {
	this.cx = this.cx || Math.random() * g_canvas.width;
	this.cy = this.cy || util.randRange(50, g_canvas.height - 300);
};

Bird.prototype.randomiseVelocity = function () {
	var MIN_SPEED = 50;
	var MAX_SPEED = 70;

	var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;

	this.velX = speed;
};

Bird.prototype.update = function (du) {

	spatialManager.unregister(this);

	var hitEntity = this.findHitEntity();

    if(hitEntity) {
        if(hitEntity instanceof Ship) {
            hitEntity.warp();
        }
        else if (hitEntity instanceof Bullet) {
            this.takeBulletHit();
            hitEntity.kill();
        }
    }

    this.wingFlapTime = this.wingFlapTime + NOMINAL_UPDATE_INTERVAL;

    if (this.wingFlapTime < this.wingFlapDelay / 2) {
    	this.sprite = g_sprites.bird_down;
    } else {
    	this.sprite = g_sprites.bird_up;
    }

    if (this.wingFlapTime > this.wingFlapDelay) {
    	this.wingFlapTime = 0;
    }

    this.cx += this.velX * du;
    this.cy += (Math.sin(this.cx / 2.5)) * du;

    this.wrapPosition();

    spatialManager.register(this);

    if (this._isDeadNow) {
		spatialManager.unregister(this);
		return entityManager.KILL_ME_NOW;
    }

};

Bird.prototype.getRadius = function () {
	return this.scale * (this.sprite.width / 2) * 0.9;
};

Bird.prototype.takeBulletHit = function () {
	this.kill();
};

Bird.prototype.render = function (ctx) {
	var origScale = this.sprite.scale;
	this.sprite.scale = this.scale;
	this.sprite.drawWrappedCentredAt(
		ctx, this.cx, this.cy, this.rotation
	);
};
