function getHighScores(){
	

	if(typeof(Storage)!== "undefined"){

		// there is somthing stored in the local storage
		if(localStorage["highScore"]) {	
			current_scores = JSON.parse(localStorage["highScore"]);
			current_scores = current_scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

			gameManager._highScoreList = current_scores;

			console.log(current_scores);
		}

		//for loopa i gegnum gögn eða updatea breytu !!!!!!1

	}

	else{

		//there is nothing stored
	}
}


function updateHighScore(thisScore){

	if(typeof(Storage)!== "undefined"){

		//get score here
		var isHighscores = false;

		if(localStorage["highScore"]){

			scores = JSON.parse(localStorage["highScore"]);

			scores.push(thisScore);
			
			scores = scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

			localStorage["highScore"] = JSON.stringify(scores.slice(0, 10));
		}

		else{
			var scores = new Array();
			var tempObject = {
				name:thisScore.name,
				score:thisScore.score
			};
			scores[0] = tempObject;
			localStorage["highScore"] = JSON.stringify(scores);

		}
	}
}

function isInHighScore(score){

		if(typeof(Storage)!== "undefined"){


		if(localStorage["highScore"]){

			scores = JSON.parse(localStorage["highScore"]);
			
			scores = scores.sort(function(a,b) { return parseInt(b.score) - parseInt(a.score) } );

			console.log(score);
			if(typeof scores[9] === 'undefined' || parseInt(scores[9].score)<score){
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

