/* global require, __dirname, process */

var changed    = require('gulp-changed');
var clean      = require('gulp-clean');
var fs         = require('fs');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var karma      = require('karma');
var livereload = require('gulp-livereload');
var path       = require('path');
var plumber    = require('gulp-plumber');
var replace    = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var tinylr     = require('tiny-lr');
var traceur    = require('gulp-traceur');
var exec       = require('child_process').exec;

// Constants
// ---------

var SRC_DIR        = './src/';
var BUILD_DIR      = './build/';
var SPEC_SRC_DIR   = './spec/';
var SPEC_BUILD_DIR = './spec_build/';

// Cleanup Tasks
// -------------

gulp.task('clean', function(){
  return gulp.src(BUILD_DIR, {read:false})
             .pipe(clean());
});

gulp.task('spec-clean', function(){
  return gulp.src(SPEC_BUILD_DIR, {read:false})
             .pipe(clean());
});


// Compile Tasks
// -------------

gulp.task('code', function(){
  return gulp.src(SRC_DIR+'**/*.js')
             .pipe(changed(BUILD_DIR))
             .pipe(plumber())
             .pipe(sourcemaps.init())
               .pipe(traceur({
                 modules:'instantiate',
                 asyncFunctions:true
               }))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest(BUILD_DIR));
});
gulp.task('code-spec', function(){
  return gulp.src(SPEC_SRC_DIR+'**/*.js')
             .pipe(changed(SPEC_BUILD_DIR))
             .pipe(plumber())
             .pipe(sourcemaps.init())
             .pipe(traceur({
               modules:'instantiate',
               asyncFunctions:true
             }))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest(SPEC_BUILD_DIR));
});


gulp.task('compile', ['code',
                      'code-spec']);

// Test Tasks
// ----------

gulp.task('spec-run-single', function(){
  karma.server.start({
    autoWatch:false,
    browsers:['Chrome'],
    configFile:path.resolve('./karma.conf.js'),
    singleRun:true
  });
});

gulp.task('spec-run', function(){
  karma.server.start({configFile:path.resolve('./karma.conf.js')});
});


// Watch Tasks
// -----------
gulp.task('watch', function(){
  gulp.watch(SRC_DIR+'**/*.js',          ['code']);
  gulp.watch(SPEC_SRC_DIR+'**/*.js',     ['code-spec']);
});

gulp.task('livereload', function(){
  var server = livereload({liveCss:false});
  function handleChanged(file){
    server.changed(file.path);
  }

  gulp.watch(BUILD_DIR+'**/*.js', handleChanged);
  gulp.watch(SPEC_BUILD_DIR+'**/*.js', handleChanged);

  livereload.listen();
});


// CLI Tasks
// ---------

gulp.task('default', ['clean', 'spec-clean'], function(){
  gulp.start('compile-spec-run-single');
});
gulp.task('compile-spec-run-single', ['compile'], function(){
  gulp.start('spec-run-single');
});

gulp.task('dev', ['clean', 'spec-clean'], function(){
  gulp.start('compile-watch');
});
gulp.task('compile-watch', ['compile'], function(){
  gulp.start('watch', 'livereload', 'spec-run');
});
