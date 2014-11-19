// =========
// Galaxy Lander
// =========


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
resizeGame();

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 200,
        cy : 200
    });
    
}


// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    gameManager.updateScreen(gameManager.currentScreen,du);
    /*
    //go to diffrient diagnostics depending on what screen your in
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Ship.prototype.KEY_FIRE);
    */
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false; 

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    gameManager.renderScreen(gameManager.currentScreen,ctx);


    //move this into gameScreen
    /*entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
    */
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "sprites/skip.png" /*"https://notendur.hi.is/~pk/308G/images/ship.png"*/,
        ship2  : "sprites/skip.png",
        rock   : "sprites/patrock.png",//"https://notendur.hi.is/~pk/308G/images/rock.png"
        bird_down : "sprites/fuglnidur.png",
        bird_up : "sprites/fuglupp.png",
        logo : "sprites/logo.png",
        galaxy :"sprites/starbackground.png" /*"sprites/stars.jpg"*/,
        earth: "sprites/earth.png",
        sky : "sprites/earthbackground.png",
        flag: "merica.gif",
        tree: "sprites/tree.png",
        cloud1: "sprites/cloud1.png",
        cloud2: "sprites/cloud2.png"

    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.bird_down = new Sprite(g_images.bird_down);
    g_sprites.bird_up = new Sprite(g_images.bird_up);
    g_sprites.logo = new Sprite(g_images.logo);

    g_sprites.galaxy = new Sprite(g_images.galaxy);
    g_sprites.earth = new Sprite(g_images.earth);
    g_sprites.sky = new Sprite(g_images.sky);
    g_sprites.flag = new Sprite(g_images.flag);
    g_sprites.tree = new Sprite (g_images.tree);
    g_sprites.cloud1 = new Sprite (g_images.cloud1);
    g_sprites.cloud2 = new Sprite (g_images.cloud2);



    if (g_canvas.height < 850) {
        g_sprites.logo.scale = 0.85;
    } 


    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;


    entityManager.init();
    createInitialShips();
   
    main.init();
}

// Kick it off
requestPreloads();