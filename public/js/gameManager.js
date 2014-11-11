/*

gameManager.js

To handle all the diffirent states of the game

*/

"use strict";

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
			this._renderStartingScreen(ctx);
		}
		else if(screenIndex === this.finishScreen){
			this._renderFinishScreen(ctx);
		}
		else if(screenIndex === this.highScoreScreen){
			this._renderHighscoreScreen(ctx);
		}
		else if (screenIndex === this.gameScreen){
			this._renderGameScreen(ctx);
		}


	},

	updateScreen: function(screenIndex,du){
		if(screenIndex === this.startingScreen){
			this._updateStartingScreen(du);
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


		var GameName = "Gústa Lander";
	    ctx.font = '60pt PressStart2P';		
	    util.drawTextAt(ctx,GameName,g_canvas.width/2,200,"white");

		var Play = "Play";
		var Highscore = "Highscore";
		var Controls = "Controls";
		var PlayColor = "white";
		var HighscoreColor = "white";
		var ControlsColor = "white";


	    ctx.font = '40pt PressStart2P';
	    console.log(Play.length/2)
	    if(this._StartingScreenChoice === 0){
	    	PlayColor = "blue";
	    }
	    else if (this._StartingScreenChoice === 1){
	    	HighscoreColor = "blue";

	    }
	    else if (this._StartingScreenChoice === 2){
	    	ControlsColor = "blue";

	    }

	    util.drawTextAt(ctx,Play,g_canvas.width/2,g_canvas.height/2-80+200,PlayColor);
	    util.drawTextAt(ctx,Highscore,g_canvas.width/2,g_canvas.height/2+200,HighscoreColor);
	    util.drawTextAt(ctx,Controls,g_canvas.width/2,g_canvas.height/2+80+200,ControlsColor);

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

		}
		if(eatKey(this.KEY_RIGHT)){
			//settu background til hægri
			this._StartingScreenLevel = "right";
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

	//HIGHSCORE SCREEN -----------
	_renderHighscoreScreen :function(ctx){
		
	},
	_updateHighscoreScreen: function(du){

	},
	//GAME SCREEN -----------
	_renderGameScreen :function(ctx){

		entityManager.render(ctx);
    	if (g_renderSpatialDebug) spatialManager.render(ctx);
		
	},
	_updateGameScreen: function(du){


	    processDiagnostics();
	    
	    entityManager.update(du);

	    // Prevent perpetual firing!
	    eatKey(Ship.prototype.KEY_FIRE);

	},




}

