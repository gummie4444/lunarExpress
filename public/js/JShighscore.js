function getHighScores(){

	
	var current_scores;
/*
	var global_scores = JSON.parse(highScoreData)
	if(global_scores !== "undefined"){

		current_scores = JSON.parse(highScoreData);
		current_scores = current_scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );
		gameManager._highScoreList = current_scores;


	}
*/	

	 if(typeof(Storage)!== "undefined"){

		// there is somthing stored in the local storage
		if(localStorage["highScore"]){
			current_scores = JSON.parse(localStorage["highScore"]);
			current_scores = current_scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

			gameManager._highScoreList = current_scores;
	}

	}

	else{
		gameManager._highScoreList = [{name:"get",score :"100"},{name:"loc",score :"99"},{name:"al",score :"98"},{name:"sto",score :"97"},{name:"age",score :"95"},{name:"bra",score :"94"}];
		//there is nothing stored
	}
}


function updateHighScore(thisScore){
	/*var global_scores = JSON.parse(highScoreData) !== "undefined";
	if(global_scores !== "undefined"){
		global_scores.push(thisScore);

		global_scores = global_scores.sort(function(a,b){ return parseInt(b.score)-parseInt(a.score)});

		//find out how to save  to database with pure javascript

		////////////////////////////////////77

	}
	*/

	if(typeof(Storage)!== "undefined"){

		//get score here
		var isHighscores = false;

		if(localStorage["highScore"]){

			local_scores = JSON.parse(localStorage["highScore"]);

			local_scores.push(thisScore);
			
			local_scores = local_scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

			localStorage["highScore"] = JSON.stringify(local_scores.slice(0, 10));
		}

		else{
			var local_scores = new Array();
			var tempObject = {
				name:thisScore.name,
				score:thisScore.score
			};
			local_scores[0] = tempObject;
			localStorage["highScore"] = JSON.stringify(local_scores);

		}
	}
}

function isInHighScore(score){

		if(typeof(Storage)!== "undefined"){


			if(localStorage["highScore"]){

				local_scores = JSON.parse(localStorage["highScore"]);
				
				local_scores = local_scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

				console.log(score);
				if(typeof local_scores[9] === 'undefined' || parseInt(local_scores[9].score)<score){
					return true;
				}
				else{
					return false;
				}
			}

		else{
			return true;

		}
	}
}

