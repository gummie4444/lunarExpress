function Timer() {
	this.init = new Date().getTime()
}

Timer.prototype.getTime = function() {
	var now = new Date().getTime();
	return now -this.init;
}

Timer.prototype.reset = function() {
	this.init = new Date().getTime();
}