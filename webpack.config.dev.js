const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './client/index',
  ],
  output: {
    path: __dirname,
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
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'client'),
      ],
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss',
      include: [
        path.join(__dirname, 'client'),
      ],
    }],
  },
};
