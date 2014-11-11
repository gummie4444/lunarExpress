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
		if(screenIndex === 3){
			this._renderStartingScreen(ctx);
		}
		else if(screenIndex === 4){
			this._renderFinishScreen(ctx);
		}
		else if(screenIndex === 1){
			this._renderHighscoreScreen(ctx);
		}
		else if (screenIndex === 0){
			this._renderGameScreen(ctx);
		}


	},

	updateScreen: function(screenIndex,du){
		if(screenIndex === 3){
			this._updateStartingScreen(du);
		}
		else if(screenIndex === 4){
			this._updateFinishScreen(du);
		}
		else if(screenIndex === 1){
			this._updateHighscoreScreen(du);
		}
		else if (screenIndex === 0){
			this._updateGameScreen(du);
		}
	},

	_StartingScreenChoice : 0,
	KEY_UPP  : 38,
	KEY_DOWN : 40,
	KEY_ENTER: 13,
	//STARTING SCREEN -----------
	_renderStartingScreen :function(ctx){

		//formula to let the letters be in the midle
	

		var Play = "Play";
		var Highscore = "Highscore";
		var Controls = "Controls";
		var PlayColor = "white";
		var HighscoreColor = "white";
		var ControlsColor = "white";

		var oldStyle = ctx.fillStyle;
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

	    util.drawTextAt(ctx,Play,g_canvas.width/2 - Play.length/2 * 40,g_canvas.height/2-80,PlayColor);
	    util.drawTextAt(ctx,Highscore,g_canvas.width/2 - Highscore.length/2 * 40,g_canvas.height/2,HighscoreColor);
	    util.drawTextAt(ctx,Controls,g_canvas.width/2 - Controls.length/2 * 40,g_canvas.height/2+80,ControlsColor);

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

