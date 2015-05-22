/* global __dirname, process, require */

import babel             from 'gulp-babel';
import babelify          from 'babelify';
import watchify          from 'watchify';
import browserify        from 'browserify';
import cache             from 'gulp-cached';
import connect           from 'gulp-connect';
import gulp              from 'gulp';
import gutil             from 'gulp-util';
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
import vulcanize         from 'vulcanize';

import iconsetsTask      from './build_tasks/build-iconsets.js';

// Constants
// ---------

const ENVIRONMENT = process.argv[2] === 'production' ? 'production' : 'development';
const CONFIG = require('./config/' + ENVIRONMENT + '.js');
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
    fallback: __dirname + '/app-chrome.html'
  })
);

gulp.task('prod-server', ()=>
  connect.server({
    livereload: false,
    port: 8082,
    root: [__dirname],
    fallback: __dirname + '/index.html'
  })
);


// Compile Tasks
// -------------

gulp.task('iconsets', ()=>
  iconsetsTask(gulp.src('vendor/icons/github/*.svg'))
    .pipe(gulp.dest(`${PATHS.build}/iconsets`))
);

gulp.task('styles', ()=>
  gulp.src(`${PATHS.src}css/all.css`)
    .pipe(plumber())
    .pipe(postcss([
      postcssImport({glob:true}),
      postcssMixins(),
      postcssProperties(),
      postcssCalc()
    ]))
    .pipe(gulp.dest(PATHS.build))
    .pipe(livereload())
);

// Automatically include all mixins in the `src/template/mixins/` directory
gulp.task('templates', ()=>
  gulp.src(`${PATHS.src}**/*.html`)
    .pipe(cache('templates'))
    .pipe(
      replace(
        /<CONFIG><\/CONFIG>/g,
        `<script>window.TICKER_CONFIG = ${JSON.stringify(CONFIG)}</script>`
      )
    )
    .pipe(remember('templates'))
    .pipe(gulp.dest(PATHS.build))
    .pipe(livereload())
);

gulp.task('code-elements', ()=>
  gulp.src([`${PATHS.src}elements/**/*.js`])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(cache('scripts'))
    .pipe(babel({modules:'ignore'}))
    .pipe(remember('scripts'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${PATHS.build}elements/`))
    .pipe(livereload())
);

// add custom browserify options here

gulp.task('code', (()=>{
  const b = watchify(browserify({
    entries       : [`${PATHS.src}states/appState.js`],
    insertGlobals : false,
    detectGlobals : false,
    debug         : true
  }).transform(babelify));

  function bundle(){
    return b.bundle()
      .on('error', e=>gutil.log('Browserify Error', e))
      .pipe(source('appState.js'))
      .pipe(gulp.dest(PATHS.build))
      .pipe(livereload());
  }

  b.on('update', bundle); // on any dep update, runs the bundler
  b.on('log', gutil.log); // output build logs to terminal

  return bundle;
})());

gulp.task('compile', ['code', 'code-elements', 'styles', 'templates']);

// Test Tasks
// ----------

// Watch Tasks
// -----------
gulp.task('watch', ()=>{
  livereload.listen({liveCSS: false});

  gulp.watch(`${PATHS.src}**/*.html`, ['templates']);
  gulp.watch(`${PATHS.src}**/*.css`, ['styles']);
  gulp.watch(`${PATHS.src}(models|states|helpers)/**/*.js`, ['code']);
  gulp.watch(`${PATHS.src}elements/**/*.js`, ['code-elements']);
});


// CLI Tasks
// ---------

gulp.task('dev', ['clean', 'server'], ()=>
  gulp.start('compile-watch')
);
gulp.task('compile-watch', ['compile', 'iconsets'], ()=>
  gulp.start('watch')
);

gulp.task('production', ['clean', 'spec-clean'], ()=>
  gulp.start('prod-compile')
);
gulp.task('prod-compile', ['templates', 'styles', 'code-prod', 'iconsets'], ()=>
  vulcanize.setOptions({
    inline:true,
    strip:true,
    input:'build/index.html',
    output:'build/index.html'
  }, vulcanize.processDocument )
);
