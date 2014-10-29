var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    wiredep = require('wiredep');




gulp.task('js', function() {
	return gulp.src('public/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(connect.reload());
});


gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('bower', function () {
  wiredep({
    src: './public/index.html',
    directory: './public/'
  });
});

gulp.task('watch', function () {
  gulp.watch(['./public/js/*.js'], ['js']);
  gulp.watch(['./public/img/*'], ['bower']);
});

gulp.task('default', ['connect', 'watch', 'js', 'bower']);
