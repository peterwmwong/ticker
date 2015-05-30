/* global __dirname, process */

import autoprefixer      from 'autoprefixer';
import babel             from 'gulp-babel';
import babelify          from 'babelify';
import watchify          from 'watchify';
import browserify        from 'browserify';
import cache             from 'gulp-cached';
import connect           from 'gulp-connect';
import gulp              from 'gulp';
import gutil             from 'gulp-util';
import history           from 'connect-history-api-fallback';
import livereload        from 'gulp-livereload';
import plumber           from 'gulp-plumber';
import postcss           from 'gulp-postcss';
import postcssCalc       from 'postcss-calc';
import postcssProperties from 'postcss-custom-properties';
import postcssImport     from 'postcss-import';
import postcssMixins     from 'postcss-mixins';
import remember          from 'gulp-remember';
import replace           from 'gulp-replace';
import rimraf            from 'rimraf';
import source            from 'vinyl-source-stream';
import sourcemaps        from 'gulp-sourcemaps';
import versionify        from 'browserify-versionify';

import iconsetsTask      from './build_tasks/build-iconsets.js';

import connectGzip       from 'connect-gzip';

// Constants
// ---------

const IS_DEV = process.argv[2] !== 'production';
const PATHS = {
  src       : './src/',
  build     : './build/',
  specSrc   : './spec/',
  specBuild : './spec_build/'
};

// Cleanup Tasks
// -------------

gulp.task('clean', done=>rimraf(PATHS.build, done));

// Static Server
// -------------

gulp.task('server', ()=>
  connect.server({
    livereload: false,
    port: 8081,
    root: [__dirname],
    fallback: __dirname + '/app.html'
  })
);

gulp.task('prod-server', ()=>
  connect.server({
    livereload: false,
    port: 8082,
    root: [__dirname],
    middleware(){
      return [
        history({
          rewrites:[
            {from: /\/github\/.*/, to: '/index.html'}
          ]
        }),
        connectGzip.gzip()
      ];
    }
  })
);


// Compile Tasks
// -------------

gulp.task('iconsets', ()=>
  iconsetsTask(gulp.src('vendor/icons/github/*.svg'))
    .pipe(replace(/[ ]{2}<svg viewBox=".*[\n]/g, ''))
    .pipe(replace(/[ ]{2}<\/svg>.*[\n]/g, ''))
    .pipe(replace(/<g id="\w/g, '<g id="'))
    .pipe(gulp.dest(`${PATHS.build}/iconsets`))
);

gulp.task('styles', ()=>
  gulp.src(`${PATHS.src}css/all.css`)
    .pipe(plumber())
    .pipe(postcss([
      postcssImport({glob:true}),
      postcssMixins(),
      postcssProperties(),
      postcssCalc(),
      autoprefixer({browsers: ['last 2 version']})
    ]))
    .pipe(gulp.dest(PATHS.build))
    .pipe(livereload())
);

// Automatically include all mixins in the `src/template/mixins/` directory
gulp.task('templates', ()=>
  gulp.src(`${PATHS.src}**/*.html`)
    .pipe(cache('templates'))
    .pipe(remember('templates'))
    .pipe(gulp.dest(PATHS.build))
    .pipe(livereload())
);

gulp.task('code-elements', ()=>
  gulp.src([`${PATHS.src}elements/**/*.js`])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(cache('scripts'))
    .pipe(replace(/IS_DEV/g, `${IS_DEV}`))
    .pipe(babel({modules:'ignore'}))
    .pipe(remember('scripts'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${PATHS.build}elements/`))
    .pipe(livereload())
);

const codeBundle = browserify({
  entries       : [`${PATHS.src}states/appState.js`],
  insertGlobals : false,
  detectGlobals : false,
  debug         : true
}).transform(versionify, {
    placeholder:'IS_DEV',
    version:`${IS_DEV}`
  }).transform(babelify);

function buildCodeBundle(){
  return codeBundle.bundle()
    .on('log',  ()=>gutil.log('Browserify Log'))
    .on('error', e=>gutil.log('Browserify Error', e))
    .pipe(source('appState.js'))
    .pipe(gulp.dest(PATHS.build))
    .pipe(livereload());
}

gulp.task('code', buildCodeBundle);

gulp.task('compile', ['code', 'code-elements', 'styles', 'templates']);

// Test Tasks
// ----------

// Watch Tasks
// -----------
gulp.task('watch', ()=>{
  livereload.listen({liveCSS: false});

  gulp.watch(`${PATHS.src}**/*.html`,        ['templates']);
  gulp.watch(`${PATHS.src}**/*.css`,         ['styles']);
  gulp.watch(`${PATHS.src}elements/**/*.js`, ['code-elements']);

  codeBundle.bundle();
  watchify(codeBundle).on('update', buildCodeBundle);
});


// CLI Tasks
// ---------

gulp.task('dev', ['clean', 'server'], ()=>
  gulp.start('compile-watch')
);
gulp.task('compile-watch', ['compile', 'iconsets'], ()=>
  gulp.start('watch')
);

gulp.task('production', ['clean'], ()=>
  gulp.start('prod-compile')
);
gulp.task('prod-compile', ['compile', 'iconsets']);
