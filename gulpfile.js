var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');


gulp.task('connect',function(){
  connect.server({
    root:'public',
    livereload:true
  });

});

gulp.task('html',function(){
  gulp.src('public/*.html')
  .pipe(connect.reload());
});

//SKOÐA BÆTA JSHINT INN
//.pipe(jshint())
// .pipe(jshint.reporter(stylish))
gulp.task('js', function() {
  return gulp.src('public/js/*.js')
    .pipe(connect.reload());
});

gulp.task('watch',function(){
  gulp.watch('public/*.html',['html'])
  gulp.watch('public/js/*.js',['js'])
});



gulp.task('default',['connect','html','js','watch'])