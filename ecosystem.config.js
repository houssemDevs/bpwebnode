module.exports = {
  apps: [
    {
      name: 'worker',
      script: './build/main.js',
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
  deploy: {
    production: {
      user: 'Administrateur',
      host: '192.168.0.101',
      ref: 'master',
      repo: '.',
      path: 'D:/WWW/Services/PhaseChantier',
      ssh_options: 'StrictHostKeyChecking=no',
      'post-deploy': 'npm install && pm2 startOrRestart .ecosystem.config.js --env production',
    },
  },
};
