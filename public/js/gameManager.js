/*

gameManager.js

To handle all the diffirent states of the game

*/

"use strict";
var g_theme = new Audio("sounds/Deeper.ogg");
	g_theme.loop = true;
	g_theme.volume = 0.8;
	
	//LAGA
var g_moveBackground_x = 0;
var g_moveBackground_y = 0;

var gameManager = {

	//

	gameScreen : 0,
	highScoreScreen : 1,
	controlsScreen : 2,
	startingScreen : 3,
	finishScreen : 4,
	nameInputScreen :5,
	level_array :["Moon","Mars","Earth"],

	currentScreen :3,


	renderScreen: function(screenIndex,ctx){
		this._drawCurrentLevelBackground(ctx);
	
		if(screenIndex === this.startingScreen){
			entityManager.render(ctx);
			this._renderStartingScreen(ctx);
			
		}
		else if(screenIndex === this.finishScreen){
			//entityManager.render(ctx);
			this._renderFinishScreen(ctx);
		}
		else if(screenIndex === this.highScoreScreen){
			//entityManager.render(ctx);
			this._renderHighscoreScreen(ctx);
		}
		else if (screenIndex === this.gameScreen){

			this._renderGameScreen(ctx);
		}

		else if (screenIndex === this.nameInputScreen){

			this._renderNameInputScreen(ctx);

		}

		else if (screenIndex === this.controlsScreen) {
			this._renderControlsScreen(ctx);

		}


	},

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

	_StartingScreenChoice : 0,
	_StartingScreenLevel :null,

	KEY_UPP  : 38,
	KEY_LEFT : 37,
	KEY_RIGHT : 39,
	KEY_DOWN : 40,
	KEY_ENTER: 13,


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

			util.drawTextAt(ctx,"YOU MADE IT TO THE HIGHSCORE",g_canvas.width/2,g_canvas.height/2-150,letter2Color);
			util.drawTextAt(ctx,"WRITE YOUR INITIALS",g_canvas.width/2,g_canvas.height/2-50,letter2Color)
		 

		   	    if(this._currentLetter === 0){
			    	letter1Color = "purple";
			    }
			    else if (this._currentLetter=== 1){
			    	letter2Color = "purple";

			    }
			    else if (this._currentLetter === 2){
			    	letter3Color = "purple";

			    }

			    //triangle

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

				if(this._arrowColor){
					ctx.fillStyle= "purple";
				}
				else{
					ctx.fillStyle= "white";
				}
				ctx.fill();






		   util.drawTextAt(ctx,this._letter1,g_canvas.width/2-50,g_canvas.height/2+50,letter1Color);
		   util.drawTextAt(ctx,this._letter2,g_canvas.width/2,g_canvas.height/2+50,letter2Color);
		   util.drawTextAt(ctx,this._letter3,g_canvas.width/2+50,g_canvas.height/2+50,letter3Color);


	},

	_updateNameInputScreen :function(du){
		//SETJA ÞENNAN SKÍT Í EITTHVAÐ FALL
		///--------------------
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
		///------------------------------

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
		///------------------------------


		///------------------------------
		if(eatKey(this.KEY_LEFT)){
			if(this._currentLetter === 0){
				this._currentLetter = 2;
			}
			else{
				this._currentLetter --;

			}
			this._arrowMove = this._currentLetter * 48;
			
		}
		///------------------------------
		///------------------------------

		if(eatKey(this.KEY_RIGHT)){
			if(this._currentLetter === 2){
				this._currentLetter = 0;
			}
			else{
				this._currentLetter ++;
			}
			this._arrowMove = this._currentLetter * 48;
		}
		///------------------------------

		if(eatKey(this.KEY_ENTER)){
			console.log(scoreManager.score);
			updateHighScore({name:this._letter1 + this._letter2 + this._letter3,score : scoreManager.score});

			this.currentScreen = this.highScoreScreen;
			//scoreManager.reset();

		}



	},


	
	//STARTING SCREEN -----------
	_renderStartingScreen :function(ctx){


		//formula to let the letters be in the midle

		//this._drawCurrentLevelBackground(ctx);

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

	    util.drawTextAt(ctx,Play,g_canvas.width/2,g_canvas.height/2-80+240,PlayColor);
	    util.drawTextAt(ctx,Highscore,g_canvas.width/2,g_canvas.height/2+240,HighscoreColor);
	    util.drawTextAt(ctx,Controls,g_canvas.width/2,g_canvas.height/2+80+240,ControlsColor);

	    //TODO MAKE THIS SPRITES
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
		//ef arrowkey upp
		if (eatKey(this.KEY_UPP)){
			if (this._StartingScreenChoice === 0){
				this._StartingScreenChoice = 2;
			}
			else{
			this._StartingScreenChoice -= 1;
			}
		}
		//ef arrowkey niður
		if (eatKey(this.KEY_DOWN)){
			if (this._StartingScreenChoice === 2){
				this._StartingScreenChoice = 0;
			}
			else{
			this._StartingScreenChoice += 1;
			}
		}

		if(eatKey(this.KEY_LEFT)){
			//settu background til vinstri
			this._StartingScreenLevel = "left";
			
			if (g_currentLevel > 0) {
				g_currentLevel--;
			} else {
				g_currentLevel = 2;
			}

			 entityManager.reset();
			 spatialManager.reset();
		}
		if(eatKey(this.KEY_RIGHT)){
			//settu background til hægri
			this._StartingScreenLevel = "right";

			if (g_currentLevel < 2) {
				g_currentLevel++;
			} else {
				g_currentLevel = 0;
			}

			 entityManager.reset();
			 spatialManager.reset();
		}
 
		if(eatKey(this.KEY_ENTER)){
			console.log("hallo")
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
	    util.drawTextAt(ctx,"score:" + scoreManager.score,g_canvas.width/2,g_canvas.height/2+50,"white");

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
	//TODOOOOOOOOO
	//DO THIS BETTER DERP SOLUTION
	_highScoreList : [],
	_firstReload : true,

	//HIGHSCORE SCREEN -----------
	_renderHighscoreScreen :function(ctx){

		//every time we lounch it for the first time get the highscores
		if(this._firstReload){
			getHighScores();
			this._firstReload = false;

		}


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
			util.drawTextAt(ctx,this._highScoreList[i].score,g_canvas.width/2,330,"white");
			}
			else if (i === 1){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2-179,320,"white");
			util.drawTextAt(ctx,this._highScoreList[i].score,g_canvas.width/2-179,360,"white");

			}
			else if (i === 2){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2+179,340,"white");
			util.drawTextAt(ctx,this._highScoreList[i].score,g_canvas.width/2+179,380,"white");

			}
			else{
			ctx.textAlign = "left";
			util.drawTextAt(ctx,i+1 + " " + this._highScoreList[i].name + " " +this._highScoreList[i].score,g_canvas.width/2-120 ,400+(i*40),"white");
			}
		}

		
	},
	_updateHighscoreScreen: function(du){

		//maby do this
		//this._firstrealod = true;

		if(eatKey(this.KEY_ENTER)){
			this.currentScreen = this.startingScreen;
		}

	},

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


	_drawEarthBackground : function(ctx) {
		g_sprites.sky.scale = 1.01;
		g_sprites.sky.drawCentredAt(ctx,g_canvas.width/2-this.moveTemp_x/15,g_canvas.height/2-this.moveTemp_y/15,0);
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


	//GAME SCREEN -----------
	moveTemp_x :0,
	moveTemp_y :0,
	_renderGameScreen :function(ctx){


		//this._drawCurrentLevelBackground(ctx);
		entityManager.render(ctx);
    	if (g_renderSpatialDebug) spatialManager.render(ctx);
		
		scoreManager.render(ctx);
	},
	_updateGameScreen: function(du){

		this.moveTemp_x += g_moveBackground_x;
		this.moveTemp_y += g_moveBackground_y;

		g_theme.play();
		

	    processDiagnostics();
	    
	    entityManager.update(du);
	    scoreManager.update(du);

	    // Prevent perpetual firing!
	    eatKey(Ship.prototype.KEY_FIRE);

	},

	// controlMenuShip : new Ship({
	// 	cx : 400,
	// 	cy : 400,
 //    	sprite : g_sprites.ship}),

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

