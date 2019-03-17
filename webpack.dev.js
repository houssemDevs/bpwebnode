const path = require('path');

const merge = require('webpack-merge');
const cleanBuildDir = require('clean-webpack-plugin');

module.exports = merge(require('./webpack.common'), {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [new cleanBuildDir(['build'], { root: __dirname, verbose: true })],
});
