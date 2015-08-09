var gulp = require('gulp');
var clean = require('gulp-clean');
var babel = require('gulp-babel');

gulp.task('default', ['transpiling'], function () {});

gulp.task('transpiling',['copy'], function () {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy',['clean'], function () {
  gulp.src('src/views/*.*').pipe(gulp.dest('dist/public'));
  gulp.src('src/js/*.*').pipe(gulp.dest('dist/public/js'));
  gulp.src('src/css/*.*').pipe(gulp.dest('dist/public/css'));
                       
  gulp.src('node_modules/bootstrap/dist/**/*').pipe(gulp.dest('dist/public/vendor/bootstrap'));
  gulp.src('node_modules/openlayers/dist/*.*').pipe(gulp.dest('dist/public/vendor/openlayers'));
  gulp.src('node_modules/jquery/dist/*.*').pipe(gulp.dest('dist/public/vendor/jquery'));


});

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});
