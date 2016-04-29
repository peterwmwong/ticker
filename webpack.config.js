var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');

module.exports = {
  entry: {
    app: ['./src/components/App.jsx']
  },
  output: {
    path    : 'dist',
    filename: 'App.js'
  },
  module: {
    loaders: [
      {
        test   : /\.jsx?$/,
        loader : 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title   : 'ticker',
      template: '_index.html'
    })
  ]
};
