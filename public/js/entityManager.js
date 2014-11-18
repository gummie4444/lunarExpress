/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_enemies : [],
_bullets : [],
_ships   : [],
_explosions : [],
_birds   : [],
_asteroids: [],
landscape : new Landscape(),

_bShowRocks : true,

// "PRIVATE" METHODS
reset : function() {
    this._birds = [];
    this._asteroids = [];
    this._bullets = [];
    this.resetShips();
    this.landscape = new Landscape();
    

    this._bShowRocks = true;
    this.deferredSetup();
    this.init();
},

_generateBirds : function() {   
    
    var numBirds = Math.floor(Math.random() * 2) + 1;

    for (var i = 0; i <= numBirds; i++) {
        this.generateBird();
    }
},

_generateAsteroids : function() {
    this.asteroidsTime += NOMINAL_UPDATE_INTERVAL;

    if (this.asteroidsTime > 2000) {
        if (Math.random() < 0.4) {
            this.generateAsteroid();
        }
        this.asteroidsTime = 0;
    }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {

    this._categories = [this._rocks, this._birds, this._asteroids, this._bullets, this._ships, this._explosions];

},

init: function() {
    if (currentLevel === 2) this._generateBirds();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},

getLandscape: function(i) {
    return this.landscape[i];
},


generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},

generateBird : function(descr) {
    this._birds.push(new Bird(descr));
},

generateAsteroid : function(descr) {
    this._asteroids.push(new Asteroid(descr));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

generateExplosion : function(x , y , colour) {
    var explosion = new Explosion(x, y , colour);
    this._explosions.push(explosion);
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

asteroidsTime : 0,

update: function(du) {
    
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

    if (currentLevel != 0) this._generateAsteroids();


},

render: function(ctx) {

    this.landscape.render(ctx);

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

