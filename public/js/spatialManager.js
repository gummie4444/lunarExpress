/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//


//Adds a value to the _entities array:
_add: function(id, pos) {
    this._entities.push({spatialID: id, entity: pos});
},

//Deletes a value from the _entities array:
_delete: function(id) {

    for(var i=0; i<this._entities.length; i++)
    {
        if(this._entities[i].spatialID === id)
        {
            this._entities.splice(i, 1);
            break;
        }

    }

},



// PUBLIC METHODS

getNewSpatialID : function() {
    return this._nextSpatialID++;

},

register: function(entity) {
    var spatialID = entity.getSpatialID(); 
    var pos = entity.getPos();
    pos.radius = entity.getRadius();
    pos.entity = entity;
    this._add(spatialID,pos);

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    this._delete(spatialID);

},

findEntityInRange: function(posX, posY, radius) {
    var closestEntity = undefined;

    for(var i=0; i<this._entities.length; i++)
    {
        var e = this._entities[i].entity;
        var distSq = util.distSq(posX,posY,e.posX,e.posY);
        var radiiSumSq = util.square(radius  + e.radius);

        if(radiiSumSq>=distSq){
            closestEntity = e.entity;
            return closestEntity;
            
        }

    }
    
    return closestEntity;
    // TODO: YOUR STUFF HERE!

},

reset: function() {
    this._entities = [];
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for(var i=0; i<this._entities.length; i++){
        var e = this._entities[i].entity;
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    
    ctx.strokeStyle = oldStyle;
}

}
