const path = require('path');

module.exports = {
  entry: './client/index.js',

  output: {
    path: path.resolve('client'),
    filename: 'bundle.js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }]
  }
};