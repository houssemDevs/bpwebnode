import { ConnectionConfig } from 'tedious';

export interface IConnectionConfig extends ConnectionConfig {
  filter?: {
    where: string;
  };
}

export interface IStreamReduxResult {
  main_source: boolean;
  list: any[];
}
