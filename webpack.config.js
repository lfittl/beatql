const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './client/index',
  ],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, 'client'),
        ],
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss',
        include: [
          path.join(__dirname, 'client'),
        ],
      },
      {
        test: /\.json$/,
        loader: 'json',
      }
    ],
  },
};
