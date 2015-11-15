var config  = require('./webpack.config.js');
var webpack = require('webpack');

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    sourceMap: false
  })
);

config.devtool = 'source-map';

module.exports = config;
