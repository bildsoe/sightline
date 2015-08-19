var gulp = require('gulp'),
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    server = require('gulp-develop-server'),
    bs = require('browser-sync');


var notFirstTime = false;

var options = {
    server: {
        path: 'dist/app.js',
        middleware: function (req, res, next) {
            console.log('Adding CORS header for ' + req.method + ': ' + req.url);
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }
    },
    bs: {
        proxy: 'http://localhost:3000'
    }
};

gulp.task('default',['server:start','transpiling','copy'], function () {
  gulp.watch('src/app/app.js', ['transpiling']);
  gulp.watch('src/views/*.html', ['copy']);
  gulp.watch('src/js/*.js', ['copy']);
});

gulp.task('server:start', function () {
  gulp.task( 'server:start', function() {
    server.listen( options.server, function( error ) {
        if( ! error ) bs( options.bs );
    });
  });
});

gulp.task('transpiling', function () {
  return gulp.src('src/app/*')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
    .pipe( bs.reload({ stream: true }) );
});

gulp.task('copy',['clean'], function () {
  gulp.src('src/views/*.*').pipe(gulp.dest('dist/public'));
  gulp.src('src/js/*.*').pipe(gulp.dest('dist/public/js'));
  gulp.src('src/css/*.*').pipe(gulp.dest('dist/public/css'));
                       
  gulp.src('node_modules/bootstrap/dist/**/*').pipe(gulp.dest('dist/public/vendor/bootstrap'));
  gulp.src('node_modules/openlayers/dist/*.*').pipe(gulp.dest('dist/public/vendor/openlayers'));
  gulp.src('node_modules/jquery/dist/*.*').pipe(gulp.dest('dist/public/vendor/jquery'));
  gulp.src('node_modules/proj4/dist/*.*').pipe(gulp.dest('dist/public/vendor/proj4'));

  if(notFirstTime){
    server.restart( function( error ) {
      if( ! error ) bs.reload();
    });
  }

  notFirstTime = true;
});

gulp.task('clean', function () {
  return gulp.src('dist/public', {read: false})
    .pipe(clean());
});


