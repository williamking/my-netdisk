'use strict';

const webpack = require('webpack');

const plugins = [
  // new webpack.optimize.CommonsChunkPlugin({
  // name: '',
  // chunks: []
  // })
]

module.exports = {
  watch: false,
  entry: {
    'app': __dirname + '/app/app.jsx'
  },
  output: {
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js',
    publicPath: __dirname + '/public/dist'
  },
  module: {
    loaders: [
      {
        test: /\.sass$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=stage-2',
        exclude: [/node_modules/]
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0,presets[]=stage-2,plugins[]=transform-react-jsx-source',
        exclude: [/node_modules/]
      }
    ],
  },
  plugins
}
