// =========
// Handles game window size
// =========

window.addEventListener('resize', resizeGame);


function resizeGame(evt) {
	if(window.innerWidth < 956 ){
		g_canvas.width = 926;	
	}
	else{
		g_canvas.width = window.innerWidth-30;
	}

	if(window.innerHeight < 730){
		g_canvas.height = 700;
	}
	else{
		g_canvas.height = window.innerHeight-30;
	}
}