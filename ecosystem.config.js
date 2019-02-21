const path = require('path');

module.exports = {
  apps: [
    {
      name: 'service',
      script: path.resolve(__dirname, 'main.js'),
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 6000
      },
    },
  ],
};
