var Highscore = Parse.Object.extend("Highscore");
var score = new Highscore();

function saveScore(scoreObj){

	score.set("Name",scoreObj.Name);
	score.set("Totalscore",scoreObj.Totalscore);
	score.set("Map",scoreObj.Map);

	score.save(null, {
  success: function(score) {
    // náiði að savea
    console.log("yolo")
    
  },
  error: function(score, error) {
    // villa

  }
});
}


function fetchHighScore(){

  var query = new Parse.Query(Highscore);

  query.ascending("Totalscore"); // Sorts the results in ascending order by the score field
  query.limit(10); //only top 10 result


  query.find({
  success: function(results) {
    for(var i = 0;i<results.length;i++){
     console.log( results[i].get("Totalscore"));
    }
  },
  error: function(error) {
    console.log("villa");
  }
});

	
}

var derp = {
  Name:"gummi",
  Totalscore:40,
  Map:"Moon"
}

saveScore(derp);
fetchHighScore();