var browserify = require('browserify')
var gulp = require('gulp')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var less = require('gulp-less')


function jsBundle(min) {
  var stream = browserify({
    debug: !min,
    ignore: [],
    bundleExternal: false
  })
    .add('./built/front/index.js')
    .bundle()
    .pipe(source('./index.js'))
    .pipe(buffer())


  return stream.pipe(gulp.dest('./static/dist'))
}

// for development
gulp.task('js', function() {
  return jsBundle(false)
})

// for production
gulp.task('js-production', function() {
  return jsBundle(true)
})

gulp.task('less', function () {
  return gulp.src('./src/front/index.less')
    .pipe(less())
    .pipe(gulp.dest('./static/dist'))
})

gulp.task('watch', ['js', 'less'], function () {
  gulp.watch(['built/front/*.js', 'built/front/**/*.js'], ['js'])
  gulp.watch(['src/front/*.less', 'src/front/**/*.less'], ['less'])
})

gulp.task('dev', ['js', 'less'])

gulp.task('default', ['js-production', 'less'])
