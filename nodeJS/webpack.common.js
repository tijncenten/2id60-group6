const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextPlugin('../css/[name].bundle.css', {
  filename: 'style.css'
})

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/js/apiHandler.js', './src/js/chat.js', './src/reactjs/App.jsx']
  },
  output: {
    path: path.resolve(__dirname, '..', 'socialMedia', 'static', 'js'),
    filename: '[name].bundle.js',
    publicPath: path.resolve(__dirname, '..', 'socialMedia', 'static', 'css')
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-regenerator']
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-regenerator']
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: extractPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    extractPlugin
  ],
  stats: {
    colors: true
  }
};
