/* global require, __dirname, process */

var changed    = require('gulp-changed');
var clean      = require('gulp-clean');
var connect    = require('gulp-connect');
var fs         = require('fs');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var jade       = require('gulp-jade');
var jadeLib    = require('jade');
var karma      = require('karma');
var livereload = require('gulp-livereload');
var path       = require('path');
var plumber    = require('gulp-plumber');
var replace    = require('gulp-replace');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var svgSprite  = require("gulp-svg-sprites");
var tinylr     = require('tiny-lr');
var traceur    = require('gulp-traceur');
var exec       = require('child_process').exec;
var vulcanize  = require('vulcanize');


// Constants
// ---------

var ENVIRONMENT    = process.argv[2] === 'production' ? 'production' : 'development';
var SRC_DIR        = './src/';
var BUILD_DIR      = './build/';
var SPEC_SRC_DIR   = './spec/';
var SPEC_BUILD_DIR = './spec_build/';
var CONFIG         = require('./config/' + ENVIRONMENT + '.js');


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


// Static Server
// -------------

gulp.task('server', function(){
  connect.server({
    livereload: false,
    port: 8081,
    root: [__dirname]
  });
});

// Compile Tasks
// -------------

gulp.task('iconsets', function(){
  return gulp.src('bower_components/octicons/svg/*.svg')
             .pipe(svgSprite({
               transformData:function(data){
                 data.svg.forEach(function(svg){
                   // Center the icons
                   if(svg.viewBox){
                     var viewBox = svg.viewBox.split(' ');
                     var width = +viewBox[2];
                     var translateX = (1024 - width)/2;
                     svg.correctiveTransform = "translate("+translateX+",0)";
                   }
                 });
                 return data;
               },
               mode: "defs",
               svg: {
                 defs: 'github.html'
               },
               preview: false,
               templates: {
                 defs: require('fs').readFileSync('./tasks/svg-sprite-template-core-iconset.html', 'utf-8')
               }
             }))
             .pipe(gulp.dest(BUILD_DIR+"/iconsets"));
});

// Currently, libSass cannot handle /deep/, so we use _deep_ in our source files
// and replace it with /deep/ after compilation.
function makeCompileScss(checkChanged){
  return function(){
    return gulp.src(SRC_DIR+'**/*.scss')
               .pipe(plumber())
               .pipe(checkChanged ? changed(BUILD_DIR, {extension:'.css'}) : gutil.noop())
               .pipe(sass({
                 includePaths:['src/styles', 'vendor/bourbon'],
                 sourceMap:true
               }))
               .pipe(replace('_deep_','/deep/'))
               .pipe(gulp.dest(BUILD_DIR));
  };
}
gulp.task('styles',     makeCompileScss(true));
gulp.task('styles-all', makeCompileScss(false));

// Automatically include all mixins in the `src/template/mixins/` directory
gulp.task('templates', function(){
  return gulp.src(SRC_DIR+'**/*.jade')
             .pipe(changed(BUILD_DIR, {extension:'.html'}))
             .pipe(plumber())
             .pipe(jade({
                pretty:(ENVIRONMENT == 'development'),
                basedir:'src/template/',
                parser:(function(){
                  var includeMixinsSrc = fs.readdirSync('src/template/mixins')
                                            .reduce(function(acc, mixinFn){
                                              return acc+'include /mixins/'+mixinFn.replace(/.jade$/,'')+'\n';
                                            }, '');
                  var NewParser = function(str, filename, options){
                                    jadeLib.Parser.call(this, includeMixinsSrc + str, filename, options);
                                  };
                  NewParser.prototype = jadeLib.Parser.prototype;
                  return NewParser;
                })(),
                locals:{
                  ENVIRONMENT:ENVIRONMENT,
                  CONFIG:CONFIG
                }
              }))
             .pipe(gulp.dest(BUILD_DIR));
});
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
gulp.task('code-prod', function(done){
  exec('cd src;'+
       '../node_modules/es6-module-loader/node_modules/.bin/traceur'+
       '  --modules=instantiate'+
       '  --async-functions=true'+
       '  --out all.js $(find . -name "*.js" | grep -v MOCK);'+
       'mv all.js ../build/', function(err, stdout, stderr){
    done(err);
  });
});


gulp.task('compile', ['code',
                      'code-spec',
                      'styles',
                      'templates']);

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
  gulp.watch(SRC_DIR+'**/*.jade',        ['templates']);
  gulp.watch(SRC_DIR+'**/*.scss',        ['styles']);
  gulp.watch(SRC_DIR+'styles/**/*.scss', ['styles-all']);
  gulp.watch(SRC_DIR+'**/*.js',          ['code']);
  gulp.watch(SPEC_SRC_DIR+'**/*.js',     ['code-spec']);
});

gulp.task('livereload', function(){
  var server = livereload({liveCss:false});
  function handleChanged(file){server.changed(file.path);}

  gulp.watch(BUILD_DIR+'**/*.{js,css,html}', handleChanged);
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

gulp.task('dev', ['clean', 'spec-clean', 'server'], function(){
  gulp.start('compile-watch');
});
gulp.task('compile-watch', ['compile','iconsets'], function(){
  gulp.start('watch', 'livereload', 'spec-run');
});

gulp.task('production', ['clean', 'spec-clean'], function(){
  gulp.start('prod-compile');
});
gulp.task('prod-compile', ['templates', 'styles', 'code-prod', 'iconsets'], function(){
  vulcanize.setOptions({
    inline:true,
    strip:true,
    input:'build/index.html',
    output:'build/index.html'
  }, vulcanize.processDocument );
});
