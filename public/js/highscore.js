var Highscore = Parse.Object.extend("Highscore");
var score = new Highscore();

function saveScore(scoreObj){

	score.set("Name",scoreObj.Name);
	score.set("Totalscore",scoreObj.Totalscore);
	score.set("Map",scoreObj.Map);

	score.save(null, {
  success: function(score) {
    // náiði að savea

    
  },
  error: function(score, error) {
    // villa

  }
});
}


//Up for revisement
function fetchHighScore(){

  var query = new Parse.Query(Highscore);

  query.descending("Totalscore"); // Sorts the results in ascending order by the score field

  query.find({
  success: function(results) {
    //return the top 10 scores in the right order
    if(g_developerMode) console.log(results);
    var tempArray = [];
    for(var i = 0; i<results.length;i++){
      var object = results[i];
      tempArray.push({name:object.get("Name"),Totalscore:object.get("Totalscore")});
    }
    if (tempArray.length > 10){
       tempArray= tempArray.slice(0, 10);

    }
    gameManager._highScoreList = tempArray;

  },
  error: function(error) {
    if(g_developerMode) console.log("villa");
    return false;
  }
});

	
}



