const path = require('path');

module.exports = {
  apps: [
    {
      name: 'worker',
      script: path.resolve(__dirname, 'service.js'),
      instances: 2,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
