const browserify = require('browserify')
const gulp = require('gulp')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const less = require('gulp-less')
const ts = require('gulp-typescript')
const path = require('path')

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
gulp.task('js', () => {
  return jsBundle(false)
})

// for production
gulp.task('js-production', () => {
  return jsBundle(true)
})

gulp.task('less', function () {
  return gulp.src('./src/front/index.less')
    .pipe(less())
    .pipe(gulp.dest('./static/dist'))
})

gulp.task('watch', ['js', 'less'], () => {
  gulp.watch(['built/front/*.js', 'built/front/**/*.js'], ['js'])
  gulp.watch(['src/front/*.less', 'src/front/**/*.less'], ['less'])
})

gulp.task('dev', ['js', 'less'])

gulp.task('default', ['js-production', 'less'])
