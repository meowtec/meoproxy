var browserify = require('browserify')
var tsify = require('tsify')
var gulp = require('gulp')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var less = require('gulp-less')


function tsBuild(min) {
  var stream = browserify({
//    debug: true,
    ignore: [],
    bundleExternal: false
  })
    .add('./built/front/index.js')
    .bundle()
    .pipe(source('./index.js'))
    .pipe(buffer())

  if (min) {
    stream = stream.pipe(uglify())
  }

  return stream.pipe(gulp.dest('./static/dist'))
}

// for development
gulp.task('ts', function() {
  return tsBuild(false)
})

// for production
gulp.task('ts-procudtion', function() {
  return tsBuild(true)
})

gulp.task('less', function () {
  return gulp.src('./src/front/index.less')
    .pipe(less())
    .pipe(gulp.dest('./static/dist'))
})

gulp.task('watch', ['ts', 'less'], function () {
  gulp.watch(['built/front'], ['ts'])
  gulp.watch(['src/front/*.less', 'src/front/**/*.less'], ['less'])
})

gulp.task('dev', ['ts', 'less'])

gulp.task('default', ['ts-procudtion', 'less'])
