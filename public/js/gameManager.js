/*

gameManager.js

To handle all the diffirent states of the game

*/

"use strict";
var g_theme = new Audio("sounds/Deeper.ogg");
	g_theme.loop = true;
	g_theme.volume = 0.8;
	

var gameManager = {

	//

	gameScreen : 0,
	highScoreScreen : 1,
	controlsScreen : 2,
	startingScreen : 3,
	finishScreen : 4,


	currentScreen :3,


	renderScreen: function(screenIndex,ctx){
		if(screenIndex === this.startingScreen){
			entityManager.render(ctx);
			this._renderStartingScreen(ctx);
			
		}
		else if(screenIndex === this.finishScreen){
			this._renderFinishScreen(ctx);
		}
		else if(screenIndex === this.highScoreScreen){
			entityManager.render(ctx);
			this._renderHighscoreScreen(ctx);
		}
		else if (screenIndex === this.gameScreen){
			this._renderGameScreen(ctx);
		}


	},

	updateScreen: function(screenIndex,du){
		if(screenIndex === this.startingScreen){
			this._updateStartingScreen(du);
			entityManager.update(du);
		}
		else if(screenIndex === this.finishScreen){
			this._updateFinishScreen(du);
		}
		else if(screenIndex === this.highScoreScreen){
			this._updateHighscoreScreen(du);
		}
		else if (screenIndex === this.gameScreen){
			this._updateGameScreen(du);
		}
	},

	_StartingScreenChoice : 0,
	_StartingScreenLevel :null,

	KEY_UPP  : 38,
	KEY_LEFT : 37,
	KEY_RIGHT : 39,
	KEY_DOWN : 40,
	KEY_ENTER: 13,
	//STARTING SCREEN -----------
	_renderStartingScreen :function(ctx){


		//formula to let the letters be in the midle
	
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


	    ctx.font = '40pt PressStart2P';
	    if(this._StartingScreenChoice === 0){
	    	PlayColor = "blue";
	    }
	    else if (this._StartingScreenChoice === 1){
	    	HighscoreColor = "blue";

	    }
	    else if (this._StartingScreenChoice === 2){
	    	ControlsColor = "blue";

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
	    	ArrowLeftColor = "blue";
	    }
	    else if(this._StartingScreenLevel === "right"){
	    	ArrowRightColor = "blue";
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
			
			if (currentLevel > 0) {
				currentLevel--;
			} else {
				currentLevel = 2;
			}

			 entityManager.reset();
			 spatialManager.reset();
		}
		if(eatKey(this.KEY_RIGHT)){
			//settu background til hægri
			this._StartingScreenLevel = "right";

			if (currentLevel < 2) {
				currentLevel++;
			} else {
				currentLevel = 0;
			}

			 entityManager.reset();
			 spatialManager.reset();
		}
 
		if(eatKey(this.KEY_ENTER)){
			this.currentScreen = this._StartingScreenChoice;
		}


	},

	//FINISH SCREEN -----------
	_renderFinishScreen :function(ctx){
		
	},
	_updateFinishScreen: function(du){

	},
	//TODOOOOOOOOO
	//DO THIS BETTER DERP SOLUTION
	_highScoreList : [],
	_firstReload : true,

	//HIGHSCORE SCREEN -----------
	_renderHighscoreScreen :function(ctx){

		//every time we lounch it for the first time get the highscores
		if(this._firstReload){
			fetchHighScore();
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
			util.drawTextAt(ctx,this._highScoreList[i].Totalscore,g_canvas.width/2,330,"white");
			}
			else if (i === 1){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2-179,320,"white");
			util.drawTextAt(ctx,this._highScoreList[i].Totalscore,g_canvas.width/2-179,360,"white");

			}
			else if (i === 2){
			util.drawTextAt(ctx,this._highScoreList[i].name,g_canvas.width/2+179,340,"white");
			util.drawTextAt(ctx,this._highScoreList[i].Totalscore,g_canvas.width/2+179,380,"white");

			}
			else{
			ctx.textAlign = "left";
			util.drawTextAt(ctx,i+1 + " " + this._highScoreList[i].name + " " +this._highScoreList[i].Totalscore,g_canvas.width/2-120 ,400+(i*40),"white");
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
	//GAME SCREEN -----------
	_renderGameScreen :function(ctx){

		entityManager.render(ctx);
    	if (g_renderSpatialDebug) spatialManager.render(ctx);
		
		scoreManager.render(ctx);
	},
	_updateGameScreen: function(du){
		//g_theme.src = "audio/Deeper.ogg";
		g_theme.play();
		

	    processDiagnostics();
	    
	    entityManager.update(du);
	    scoreManager.update(du);

	    // Prevent perpetual firing!
	    eatKey(Ship.prototype.KEY_FIRE);

	},




}

