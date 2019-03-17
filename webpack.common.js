const path = require('path');

module.exports = {
  target: 'node',
  node: {
    __filename: false,
    __dirname: false,
  },
  entry: {
    service: path.resolve(__dirname, './src/main.ts'),
    worker: path.resolve(__dirname, './src/workers/worker.ts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.sql$/,
        loader: 'raw-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@workers': path.resolve(__dirname, './src/workers'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
    },
    extensions: ['.ts', '.js'],
  },
};
