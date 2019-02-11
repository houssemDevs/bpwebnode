const path = require('path');

const merge = require('webpack-merge');
const cleanBuildDir = require('webpack-clean-plugin');

module.exports = merge(require('./webpack.common'), {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [new cleanBuildDir(path.resolve(__dirname, 'build'))],
});
