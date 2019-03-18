import { Readable, ReadableOptions } from 'stream';
import { ColumnValue, Connection, ConnectionConfig, Request } from 'tedious';
import { isArray } from 'util';

export default class SqlStreamWithFallBack extends Readable {
  private cnn_configs: ConnectionConfig[];
  private current_config: number;
  private main_config: boolean;
  private query: string;
  private first_payload: boolean;
  constructor(query: string, configs: ConnectionConfig[], options?: ReadableOptions) {
    super({ ...options, objectMode: true });
    this.current_config = 0;
    this.cnn_configs = configs;
    this.main_config = true;
    this.query = query;
    this.first_payload = true;

    let config: ConnectionConfig;

    config = this.cnn_configs[this.current_config++];

    const connection = new Connection(config);
    connection.on('connect', err => this.handleConnect(err, connection));
  }
  // tslint:disable-next-line: no-empty
  public _read() {}
  private handleConnect(err: Error, cnn: Connection) {
    if (err) {
      if (this.current_config < this.cnn_configs.length) {
        this.main_config = false;
        cnn = new Connection(this.cnn_configs[this.current_config++]);
        cnn.on('connect', error => this.handleConnect(error, cnn));
      } else {
        this.emit('error', err);
        this.push(null);
        cnn.close();
        return;
      }
    } else {
      const request = new Request(this.query, error => {
        if (error) {
          this.emit('error', error);
        }
        this.push(null);
        cnn.close();
        return;
      });

      request.on('row', (cols: ColumnValue[]) => {
        if (this.first_payload) {
          this.push({ main_source: this.main_config });
          this.first_payload = false;
        }
        this.push(
          cols.reduce(
            (obj, col) => ({
              ...obj,
              [col.metadata.colName]: col.value,
            }),
            {}
          )
        );
      });
      cnn.execSql(request);
    }
  }
}
