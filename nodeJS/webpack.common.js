const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/js/api-handler.js', './src/reactjs/app.jsx']
  },
  output: {
    path: path.resolve(__dirname, '..', 'socialMedia', 'static', 'js'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-regenerator']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-regenerator']
        }
      }
    ]
  },
  stats: {
    colors: true
  }
};
