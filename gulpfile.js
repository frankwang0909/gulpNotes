
var gulp = require('gulp');

var sass = require('gulp-sass');

// var coffee = require('gulp-coffee');
// var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
	sass: ['./src/sass/*.scss'],
	css: ['src/css/*.css'],
	scripts: ['src/js/**/*.js', '!src/external/**/*.js'],
	images: 'src/img/**/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
// gulp.task('clean', function() {
//   // You can use multiple globbing patterns as you would with `gulp.src`
//   return del(['build']);
// });

gulp.task('sass', function () {
 return gulp.src(paths.sass)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./build/css'));
});


gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    // .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
	'watch',
	'sass',
	'scripts',
	'images'
]);