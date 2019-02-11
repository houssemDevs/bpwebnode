const path = require('path');

module.exports = {
  target: 'node',
  node: {
    __filename: false,
    __dirname: false,
  },
  entry: path.resolve(__dirname, 'src', 'main.ts'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
