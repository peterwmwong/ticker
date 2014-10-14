module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [],
    frameworks: ['jasmine'],
    files: [
      'node_modules/es6-module-loader/node_modules/traceur/bin/traceur-runtime.js',
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js',
      'node_modules/systemjs/lib/extension-register.js',
      'src/statechart.js',
      'spec/bootstrap.js',

      {pattern: 'build/**/*',      included: false},
      {pattern: 'spec_build/**/*', included: false}
    ],
    autoWatch: true,
    singleRun: false
  });
};
