var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');

module.exports = {
  entry: {
    app: ['./src/main.js']
  },
  output: {
    path    : 'dist',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test   : /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new HtmlWebpackPlugin({
      title   : 'prezmeplease',
      template: '_index.html'
    })
  ]
};
