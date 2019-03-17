const path = require('path');

const merge = require('webpack-merge');
const cleanBuildDir = require('clean-webpack-plugin');

module.exports = merge(require('./webpack.common'), {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [new cleanBuildDir(['dist'], { root: __dirname, verbose: true })],
});
