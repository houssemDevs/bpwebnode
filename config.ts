import { ConnectionConfig } from 'tedious';

export const dbconfig: ConnectionConfig = {
  server: '192.168.0.101',
  authentication: {
    type: 'default',
    options: {
      userName: 'sa',
      password: '1.0.5.1dre2015',
    },
  },
  options: {
    encrypt: false,
    database: 'RCTC_CONSOLID_DRE',
    requestTimeout: 0,
  },
};
