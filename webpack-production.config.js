var config  = require('./webpack.config.js');
var webpack = require('webpack');

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    sourceMap: false
  }),
  new webpack.optimize.OccurenceOrderPlugin()
);

module.exports = config;
