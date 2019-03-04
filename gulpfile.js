'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')

const { moveHandlebarPages } = require('kth-node-web-common/gulp')

const globals = {
  dirname: __dirname
}

const { webpack, moveResources, sass, vendor, clean } = require('kth-node-build-commons').tasks(globals)

/* Inferno build tasks */

const infernoTask = require('kth-node-inferno/gulpTasks/infernoTask')({
  src: [
    'public/js/app/app.jsx',
    'public/js/app/embed.jsx'
  ],
  destinationPath: 'dist/js',
  exclude: /node_modules\/(?!(safe-utils)\/).*/,
  dirname: __dirname
})

const infernoServerTask = require('kth-node-inferno/gulpTasks/infernoServerTask')({
  src: [
    'public/js/app/app.jsx',
    'public/js/app/embed.jsx'
  ],
  destinationPath: 'dist/js/server',
  dirname: __dirname
})

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *
 *    $ gulp build:dev [--production | --development]
 *
 *  Deployment build
 *
 *    $ gulp build
 *
 *  Continuous re-build during development
 *
 *    $ gulp watch
 *
 *  Remove the generated files
 *
 *    $ gulp clean
 *
 */

// *** JavaScript helper tasks ***
gulp.task('webpack', webpack)
gulp.task('vendor', vendor)
gulp.task('moveHandlebarPages', moveHandlebarPages)

gulp.task('moveResources', ['moveHandlebarPages'], function () {
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome()
  )
})

gulp.task('moveImages', function () {
  // Move project image files
  return gulp.src('./public/img/**/*.*')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('transpileSass', () => sass())

gulp.task('inferno', function () {
  return mergeStream(
    infernoTask(),
    infernoServerTask()
  )
})

/**
 *
 *  Public tasks used by developer:
 *
 */

gulp.task('clean', clean)

gulp.task('build', ['moveResources', 'moveImages', 'vendor', 'webpack', 'inferno'], () => sass())

gulp.task('watch', ['build'], function () {
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
  gulp.watch(['./public/img/**/*.*'], ['moveImages'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack'])
  gulp.watch(['./public/js/app/**/*.jsx', './public/js/app/**/*.js'], ['inferno'])
})
