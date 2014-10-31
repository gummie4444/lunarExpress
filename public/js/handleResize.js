// =========
// Handles game window size
// =========

window.addEventListener('resize', resizeGame);


function resizeGame(evt) {
	g_canvas.width = window.innerWidth-30;
	g_canvas.height = window.innerHeight-30;
}