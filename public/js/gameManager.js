/*

gameManager.js

To handle all the diffirent states of the game

*/

"use strict";
//Volume
var g_theme = new Audio("sounds/Deeper.ogg");
	g_theme.loop = true;
	g_theme.volume = 0.8;
	
// Background movement
var g_moveBackground_x = 0;
var g_moveBackground_y = 0;

var gameManager = {

	//screens

	gameScreen : 0,
	highScoreScreen : 1,
	controlsScreen : 2,
	startingScreen : 3,
	finishScreen : 4,
	nameInputScreen :5,
	level_array :["Moon","Mars","Earth"],

	currentScreen :3,



	//the renderScrenn function that take cares of the game
	renderScreen: function(screenIndex,ctx){
		this._drawCurrentLevelBackground(ctx);

	
		if(screenIndex === this.startingScreen){
			if(entityManager.timeBetweenAst === 0){
				entityManager.reset();
				spatialManager.reset();
				entityManager.timeBetweenAst = 2000;
			}
			entityManager.render(ctx);
			this._renderStartingScreen(ctx);
			
		}
		else if(screenIndex === this.finishScreen){
			if(g_soundOn){
				g_soundOn = false;
			}
			entityManager.render(ctx);
			entityManager.timeBetweenAst = 0;
			this._renderFinishScreen(ctx);
			//g_soundOn
		}
		else if(screenIndex === this.highScoreScreen){
			//entityManager.render(ctx);
			this._renderHighscoreScreen(ctx);
		}
		else if (screenIndex === this.gameScreen){
			//entityManager.timeBetweenAst = 2000;
			this._renderGameScreen(ctx);
		}

		else if (screenIndex === this.nameInputScreen){

			this._renderNameInputScreen(ctx);

		}

		else if (screenIndex === this.controlsScreen) {
			this._renderControlsScreen(ctx);

		}


	},

	//updatescreen of the game
	updateScreen: function(screenIndex,du){


		if(screenIndex === this.startingScreen){
			this._updateStartingScreen(du);
			entityManager.update(du);
		}
		else if(screenIndex === this.finishScreen){
			this._updateFinishScreen(du);
			entityManager.update(du);
		}
		else if(screenIndex === this.highScoreScreen){
			this._updateHighscoreScreen(du);
			entityManager.update(du);
		}
		else if (screenIndex === this.gameScreen){
			this._updateGameScreen(du);

		}

		else if (screenIndex === this.nameInputScreen){
			this._updateNameInputScreen(du);

		}	
		else if (screenIndex === this.controlsScreen) {
			this._updateControlsScreen(du);

		}
	},

	//var for the startingScreen
	_StartingScreenChoice : 0,
	_StartingScreenLevel :null,

	//key vars
	KEY_UPP  : 38,
	KEY_LEFT : 37,
	KEY_RIGHT : 39,
	KEY_DOWN : 40,
	KEY_ENTER: 13,


	//vars for the Highscoreinput name
	_letter1 : alphabet[0],
	_letter2 : alphabet[0],
	_letter3 : alphabet[0],
	_currentLetter : 0,
	_arrowMove : 0,
	_arrowColor :true,

	_renderNameInputScreen:function(ctx){

		var letter1Color = "white";
		var letter2Color = "white";
		var letter3Color = "white";

		//text
		util.drawTextAt(ctx,"YOU MADE IT TO THE HIGHSCORE",g_canvas.width/2,g_canvas.height/2-150,letter2Color);
		util.drawTextAt(ctx,"WRITE YOUR INITIALS",g_canvas.width/2,g_canvas.height/2-50,letter2Color)
	 
		//letter color is selected
   	    if(this._currentLetter === 0){
	    	letter1Color = "purple";
	    }
	    else if (this._currentLetter=== 1){
	    	letter2Color = "purple";

	    }
	    else if (this._currentLetter === 2){
	    	letter3Color = "purple";

	    }

	    //triangle selected upp
	    var point1_x = g_canvas.width/2 -57 + this._arrowMove;
	    var point1_y = g_canvas.height/2 -20;
	    var point2_x = g_canvas.width/2 -47 + this._arrowMove;
	    var point2_y = g_canvas.height/2 -20;
	    var point3_x = g_canvas.width/2 -52 +this._arrowMove;
	    var point3_y = g_canvas.height/2 -30;
	    ctx.beginPath();
		ctx.moveTo(point1_x,point1_y);
		ctx.lineTo(point2_x,point2_y);
		ctx.lineTo(point3_x,point3_y);
		if(!this._arrowColor){
			ctx.fillStyle= "purple";
		}
		else{
			ctx.fillStyle= "white";
		}
		ctx.fill();

		//triangle selected down
	    var point1_x = g_canvas.width/2 -57 +this._arrowMove;
	    var point1_y = g_canvas.height/2 +60;
	    var point2_x = g_canvas.width/2 -47 + this._arrowMove;
	    var point2_y = g_canvas.height/2 +60;
	    var point3_x = g_canvas.width/2 -52+ this._arrowMove;
	    var point3_y = g_canvas.height/2 +70;
	    ctx.beginPath();
		ctx.moveTo(point1_x,point1_y);
		ctx.lineTo(point2_x,point2_y);
		ctx.lineTo(point3_x,point3_y);

		//arrow colors
		if(this._arrowColor){
			ctx.fillStyle= "purple";
		}
		else{
			ctx.fillStyle= "white";
		}
		ctx.fill();


		//draw letters
		util.drawTextAt(ctx,this._letter1,g_canvas.width/2-50,g_canvas.height/2+50,letter1Color);
		util.drawTextAt(ctx,this._letter2,g_canvas.width/2,g_canvas.height/2+50,letter2Color);
		util.drawTextAt(ctx,this._letter3,g_canvas.width/2+50,g_canvas.height/2+50,letter3Color);


	},

	_updateNameInputScreen :function(du){
		//logic for the pick a name for highscore

		////////////////////////////////////////////////////////////////////////
		if(eatKey(this.KEY_DOWN)){
			this._arrowColor = true;

			if(this._currentLetter === 0){
				var tempIndex = alphabet.indexOf(this._letter1);

				if(tempIndex != 25){
					this._letter1 = alphabet[++tempIndex];
				}
				else{
					this._letter1 = alphabet[0];
				}
			}

			else if(this._currentLetter === 1){
				var tempIndex = alphabet.indexOf(this._letter2);

				if(tempIndex != 25){
					this._letter2 = alphabet[++tempIndex];
				}
				else{
					this._letter2 = alphabet[0];
				}
			}

			else if(this._currentLetter === 2){
				var tempIndex = alphabet.indexOf(this._letter3);

				if(tempIndex != 25){
					this._letter3 = alphabet[++tempIndex];
				}
				else{
					this._letter3 = alphabet[0];
				}
			}

		}
		////////////////////////////////////////////////////////////////////////

		if(eatKey(this.KEY_UPP)){

			this._arrowColor = false;

			if(this._currentLetter === 0){
				var tempIndex = alphabet.indexOf(this._letter1);

				if(tempIndex != 0){
					this._letter1 = alphabet[--tempIndex];
				}
				else{
					this._letter1 = alphabet[25];
				}
			}

			else if(this._currentLetter === 1){
				var tempIndex = alphabet.indexOf(this._letter2);

				if(tempIndex != 0){
					this._letter2 = alphabet[--tempIndex];
				}
				else{
					this._letter2 = alphabet[25];
				}
			}

			else if(this._currentLetter === 2){
				var tempIndex = alphabet.indexOf(this._letter3);

				if(tempIndex != 0){
					this._letter3 = alphabet[--tempIndex];
				}
				else{
					this._letter3 = alphabet[25];
				}
			}

		}
		//////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////
		if(eatKey(this.KEY_LEFT)){
			if(this._currentLetter === 0){
				this._currentLetter = 2;
			}
			else{
				this._currentLetter --;

			}
			this._arrowMove = this._currentLetter * 48;
			
		}
		/////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////

		if(eatKey(this.KEY_RIGHT)){
			if(this._currentLetter === 2){
				this._currentLetter = 0;
			}
			else{
				this._currentLetter ++;
			}
			this._arrowMove = this._currentLetter * 48;
		}
		/////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////

		if(eatKey(this.KEY_ENTER)){
			console.log(scoreManager.score);
			updateHighScore({name:this._letter1 + this._letter2 + this._letter3,score : scoreManager.score});

			this.currentScreen = this.highScoreScreen;
			scoreManager.reset();
		}

		/////////////////////////////////////////////////////////////////////////


	},


	
	//STARTING SCREEN -----------
	_renderStartingScreen :function(ctx){

		//text and other things on the starting screen

		var oldStyle = ctx.fillStyle;
		ctx.textAlign = "center";


		var GameName = "Galaxy3 Lander";
	    ctx.font = '60pt PressStart2P';
	    var sprite = g_sprites.logo;
	    sprite.drawCentredAt(ctx, g_canvas.width / 2, 260, 0);

		var Play = "Play";
		var Highscore = "Highscore";
		var Controls = "Controls";
		var PlayColor = "white";
		var HighscoreColor = "white";
		var ControlsColor = "white";
		var selectedColor = "purple";


	    ctx.font = '40pt PressStart2P';
	    if(this._StartingScreenChoice === 0){
	    	PlayColor = selectedColor;
	    }
	    else if (this._StartingScreenChoice === 1){
	    	HighscoreColor = selectedColor;

	    }
	    else if (this._StartingScreenChoice === 2){
	    	ControlsColor = selectedColor;

	    }

	    // draw the choicess
	    util.drawTextAt(ctx,Play,g_canvas.width/2,g_canvas.height/2-80+240,PlayColor);
	    util.drawTextAt(ctx,Highscore,g_canvas.width/2,g_canvas.height/2+240,HighscoreColor);
	    util.drawTextAt(ctx,Controls,g_canvas.width/2,g_canvas.height/2+80+240,ControlsColor);

	    //right and left arrows to select level
	    var ArrowLeft = "<-";
	    var ArrowRight ="->";
	    var ArrowLeftColor ="white";
	    var ArrowRightColor = "white";
	    if(this._StartingScreenLevel === "left"){
	    	ArrowLeftColor = selectedColor;
	    }
	    else if(this._StartingScreenLevel === "right"){
	    	ArrowRightColor = selectedColor;
	    }
	    ctx.textAlign = "left";
	    util.drawTextAt(ctx,ArrowLeft,0+50,g_canvas.height/2,ArrowLeftColor);
	    ctx.textAlign = "right";
	   	util.drawTextAt(ctx,ArrowRight,g_canvas.width+4-50,g_canvas.height/2,ArrowRightColor);

	    ctx.fillStyle = oldStyle;
		

	},

	_updateStartingScreen: function(du){
		//logic for the starting screen arrow clicks and enter
		if (eatKey(this.KEY_UPP)){
			if (this._StartingScreenChoice === 0){
				this._StartingScreenChoice = 2;
			}
			else{
			this._StartingScreenChoice -= 1;
			}
		}
		
		if (eatKey(this.KEY_DOWN)){
			if (this._StartingScreenChoice === 2){
				this._StartingScreenChoice = 0;
			}
			else{
			this._StartingScreenChoice += 1;
			}
		}

		if(eatKey(this.KEY_LEFT)){
			this._StartingScreenLevel = "left";
			
			if (g_currentLevel > 0) {
				g_currentLevel--;
			} else {
				g_currentLevel = 2;
			}
			 //reset the level
			 entityManager.reset();
			 spatialManager.reset();
		}


		if(eatKey(this.KEY_RIGHT)){
			this._StartingScreenLevel = "right";

			if (g_currentLevel < 2) {
				g_currentLevel++;
			} else {
				g_currentLevel = 0;
			}
			 //reset the level
			 entityManager.reset();
			 spatialManager.reset();
		}

 		//go to the selected screen
		if(eatKey(this.KEY_ENTER)){
			this.currentScreen = this._StartingScreenChoice;
			scoreManager.reset();
			scoreManager.level = this.level_array[g_currentLevel];
		}


	},

	//FINISH SCREEN -----------
	_renderFinishScreen :function(ctx){
		var oldStyle = ctx.fillStyle;

		ctx.textAlign = "center";
		ctx.font = '60pt PressStart2P';
		util.drawTextAt(ctx,"GAME OVER",g_canvas.width/2,g_canvas.height/2,"white");
		ctx.font = '40pt PressStart2P';
	    util.drawTextAt(ctx,"score:" + Math.floor(scoreManager.score),g_canvas.width/2,g_canvas.height/2+50,"white");

	    ctx.fillStyle = oldStyle;
		
	},
	_updateFinishScreen: function(du){
			if(eatKey(this.KEY_ENTER)){

				if(isInHighScore(scoreManager.score)){
					this.currentScreen = this.nameInputScreen;
				}
				else{


				this.currentScreen = this.highScoreScreen;
				entityManager.reset();
				//scoreManager.reset();

				}

		}

	},

	//init the highscorescreen
	_highScoreList : [],


	//HIGHSCORE SCREEN -----------
	_renderHighscoreScreen :function(ctx){

		// Here we get the highscore from localstorage and
		// draw it in t he order it came

		//every time we launch it get the highscores
		getHighScores();

		var oldStyle = ctx.fillStyle;
		ctx.textAlign = "center";

		var GameName = "Highscore";
	    ctx.font = '60pt PressStart2P';		
	    util.drawTextAt(ctx,GameName,g_canvas.width/2,200,"white");

		util.fillBox(ctx,g_canvas.width/2-160/2,330,180,110,"white");
		util.fillBox(ctx,g_canvas.width/2-160/2-179,360,180,80,"white");
		util.fillBox(ctx,g_canvas.width/2-160/2+179,380,180,60,"white");
		 ctx.font = '40pt PressStart2P';	
		util.drawTextAt(ctx,"1",g_canvas.width/2,410,"black");
		ctx.font = '40pt PressStart2P';	
		util.drawTextAt(ctx,"2",g_canvas.width/2 -179,430,"black");
		ctx.font = '40pt PressStart2P';	
		util.drawTextAt(ctx,"3",g_canvas.width/2 +179,440,"black");
		ctx.font = '25pt PressStart2P';

		for(var i = 0;i<this._highScoreList.length;i++){
			if(i === 0){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2 ,290,"white");
			util.drawTextAt(ctx,Math.floor(this._highScoreList[i].score),g_canvas.width/2,330,"white");
			}
			else if (i === 1){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2-179,320,"white");
			util.drawTextAt(ctx,Math.floor(this._highScoreList[i].score),g_canvas.width/2-179,360,"white");

			}
			else if (i === 2){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2+179,340,"white");
			util.drawTextAt(ctx,Math.floor(this._highScoreList[i].score),g_canvas.width/2+179,380,"white");

			}
			else{
			ctx.textAlign = "left";
			util.drawTextAt(ctx,i+1 + " " + this._highScoreList[i].name + " " +Math.floor(this._highScoreList[i].score),g_canvas.width/2-120 ,400+(i*40),"white");
			}
		}

		
	},
	_updateHighscoreScreen: function(du){

		if(eatKey(this.KEY_ENTER)){
			this.currentScreen = this.startingScreen;
		}

	},
	//--------------------------------------------------------

	//diffrent backgrounds on diffrent levels
	_drawCurrentLevelBackground : function(ctx){
		switch(g_currentLevel){
			case 0:
				this._drawMoonBackground(ctx);
				break;
			case 1:
				this._drawMarsBackground(ctx);
				break;
			case 2:
				this._drawEarthBackground(ctx);
				break;
		}
	},

	//DIFFRENT BACKGROUNDS
	_drawEarthBackground : function(ctx) {
		//g_sprites.sky.scale = 1.01;
		//g_sprites.sky.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/15,g_canvas.height/2-this.moveTemp_y/15,0);
		
		var oldStyle = ctx.fillStyle;
		ctx.fillStyle = "#5CADFF";
		util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height);
		ctx.fillStyle = oldStyle;


		g_sprites.cloud1.scale = 0.5;
		g_sprites.cloud1.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/5 -350,g_canvas.height/2-this.moveTemp_y/5 -100,0);
		oldStyle = ctx.fillStyle;
		ctx.fillStyle = "#FFD000";
		util.fillCircle(ctx, g_canvas.width - 200, g_canvas.height - 500, 80);
		ctx.fillStyle = oldStyle;
		g_sprites.cloud2.scale = 0.5;
		g_sprites.cloud2.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/5 +150,g_canvas.height/2-this.moveTemp_y/5 -50,0);
	},

	_drawMarsBackground : function(ctx){
		g_sprites.galaxy.scale = 1.01;
		g_sprites.galaxy.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/15,g_canvas.height/2-this.moveTemp_y/15,0);
		g_sprites.earth.scale = 0.12;
		g_sprites.earth.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/5 -350,g_canvas.height/2-this.moveTemp_y/5 -100,0);
	},

	_drawMoonBackground : function(ctx){
		g_sprites.galaxy.scale = 1.01;
		g_sprites.galaxy.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/15,g_canvas.height/2-this.moveTemp_y/15,0);
		g_sprites.earth.scale = 1.01;
		g_sprites.earth.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/10 -250,g_canvas.height/2-this.moveTemp_y/10 +200,0);
	},

	//----------------------------------------------------------------

	//GAME SCREEN -----------
	// vars for the rover
	moveTemp_y : 0,
	moveTemp_x : 0,


	tempPiceCount : 0,
	tempPiceWidth : 0,
	counter : 0,
	counter2 : 0,
	x_speed : 0,
	y_speed : 0,

	rover_x :0,
	rover_y :0,
	rover_angle:0,
	_renderGameScreen :function(ctx){


		//this._drawCurrentLevelBackground(ctx);
		entityManager.render(ctx);
    	if (g_renderSpatialDebug) spatialManager.render(ctx);




    	//only draw the rover on mars
    	if(g_currentLevel === 1){

    		//ROVER-----------------
    		g_sprites.rover.scale = 0.7;
    		g_sprites.rover.drawCentredAt(ctx,this.rover_x, this.rover_y-g_sprites.ship.height / 5 + 3,this.rover_angle);
    	}
		
		scoreManager.render(ctx);
	},

	//is rover out of bounce
	_rover_bound :false,
	_updateGameScreen: function(du){
		//move the current background
		this.moveTemp_x += g_moveBackground_x;
		this.moveTemp_y += g_moveBackground_y;

		g_theme.play();
		

	    processDiagnostics();
	    
	    entityManager.update(du);
	    scoreManager.update(du);

	    //ROVER-------------E 
	    if(g_currentLevel === 1){
	    	//if we are on the right_bound
			if(this.counter+1 === entityManager.landscape.array-1){
				this._rover_bound = true;

			}
			//if we are on the left_bound
			else if(this.counter -1 === 0){
				this._rover_bound = false;
			}

			//change the rover y if we are at a new point
		    if (this.counter2 === 0){
		    	this.rover_y =g_canvas.height - entityManager.landscape.array[this.counter];
		    }

		    //calc the angle of the rover
		    this.rover_angle = (entityManager.landscape.array[this.counter]-entityManager.landscape.array[this.counter+1])/entityManager.landscape.pieceWidth;
		    //calculate the speed of the rover in x and y direction
		    this.x_speed = entityManager.landscape.pieceWidth/100;
			this.y_speed =(entityManager.landscape.array[this.counter] -entityManager.landscape.array[this.counter+1])/100;

			//the counter2 takes care of if we are at a new point
			this.counter2 += this.x_speed;

			//change the rover dest
			this.rover_x += this.x_speed;
			this.rover_y += this.y_speed;
	
			//If we are at a new point
			if(this.counter2 >= entityManager.landscape.pieceWidth){

				if(this._rover_bound){

					this.counter--;

				}
				//go to the right
				else{
					this.counter++;
				}

				this.counter2 = 0;

			}
		 }

		//ROOOOOOOOOOOOVEEERR---------------
	},


	_renderControlsScreen : function(ctx) {
		
		var textWidth = g_canvas.width / 2;
		var textHeight = g_canvas.height / 2;
		ctx.textAlign = "center";
		ctx.font = '40pt PressStart2P';
		util.drawTextAt(ctx, "Up: Thrust", textWidth, textHeight - 85,"white");
		util.drawTextAt(ctx, "Left: Rotate left", textWidth, textHeight - 15,"white");
		util.drawTextAt(ctx, "Right: Rotate right", textWidth, textHeight + 55,"white");
		util.drawTextAt(ctx, "T: mute", textWidth, textHeight + 125,"white");


	},

	_updateControlsScreen : function (du) {

		if(eatKey(this.KEY_ENTER)){
			this.currentScreen = this.startingScreen;
		}
	},




}

