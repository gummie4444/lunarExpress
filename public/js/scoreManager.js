/*

scoreManager.js

To handle the score and fuel of the bro

*/

"use strict";


var scoreManager ={
	
	score : 0,
	fuel :200,
	time : 0,
	level : "",

	reset : function(){
		this.score = 0;
		this.fuel =200;
		this.time =0;
		this.level = "";
	},
	
	render : function(ctx){
	//score
	var oldStyle = ctx.fillStyle;
	ctx.font = '10pt PressStart2P';
	ctx.textAlign = "left";
	util.drawTextAt(ctx,"Score:" + this.score,0,50,"white");
	ctx.fillStyle = oldStyle;

	//fuel

	oldStyle = ctx.fillStyle;
	ctx.font = '10pt PressStart2P';
	ctx.textAlign = "left";
	var color;
	if(this.fuel >100){
		color = "green";
	}
	else if(this.fuel >50){
		color = "orange";
	}
	else{
		color = "red";
	}
	util.drawTextAt(ctx,"Fuel:",0,70,"white");
	util.fillBox(ctx,70,55,this.fuel/2,15,color);
	util.strokeBox(ctx, 69, 54, 100, 17, "white", 2);

	ctx.fillStyle = oldStyle;


	//time

	oldStyle = ctx.fillStyle;
	ctx.font = '10pt PressStart2P';
	ctx.textAlign = "left";

	util.drawTextAt(ctx,"Time:" + Math.floor(this.time),0,90,"white");
	ctx.fillStyle = oldStyle;

	//level

	oldStyle = ctx.fillStyle;
	ctx.font = '20pt PressStart2P';
	ctx.textAlign = "center";

	util.drawTextAt(ctx,this.level,canvas.width/2,canvas.height/8,"white");
	ctx.fillStyle = oldStyle;


	},

	update : function(dx){

	this.time += NOMINAL_UPDATE_INTERVAL*0.001;
	

	},


}