var gulp = require('gulp');
var clean = require('gulp-clean');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

gulp.task('default', ['watch'], function () {});

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
  gulp.src('node_modules/proj4/dist/*.*').pipe(gulp.dest('dist/public/vendor/proj4'));
});

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('watch', ['transpiling'], function () {
   gulp.watch('src/views/*.html', ['default']);
   gulp.watch('src/js/*.js', ['default']);
});


