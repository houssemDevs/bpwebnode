const path = require('path');

module.exports = {
  apps: [
    {
      name: 'service',
      script: path.resolve(__dirname, 'service.js'),
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 6000,
      },
    },
  ],
};
