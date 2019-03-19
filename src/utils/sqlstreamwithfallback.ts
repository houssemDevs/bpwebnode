import { Readable, ReadableOptions } from 'stream';
import { ColumnValue, Connection, ConnectionConfig, Request } from 'tedious';
import { IConnectionConfig } from './types';

/**
 * Same as SqlStream,only that this class support
 * multiple configs (fallbacks), if one server is down
 * it tries the next server.
 *
 * @export
 * @class SqlStreamWithFallBack
 * @extends {Readable}
 */
export default class SqlStreamWithFallBack extends Readable {
  private cnn_configs: IConnectionConfig[];
  private current_config: number;
  private main_config: boolean;
  private query: string;
  private metadata_sent: boolean;

  /**
   * Creates an instance of SqlStreamWithFallBack.
   * @param {string} query SQL query to execute.
   * @param {IConnectionConfig[]} configs Multiple tedious config objects to fallback
   * @param {ReadableOptions} [options] Readable stream options.
   * @memberof SqlStreamWithFallBack
   */
  constructor(query: string, configs: IConnectionConfig[], options?: ReadableOptions) {
    super({ ...options, objectMode: true });
    this.current_config = 0;
    this.cnn_configs = configs;
    this.main_config = true;
    this.query = query;
    this.metadata_sent = false;

    const config = this.cnn_configs[this.current_config++];

    const connection = new Connection(config);
    connection.on('connect', err => this.handleConnect(err, connection));
  }
  // tslint:disable-next-line: no-empty
  public _read() {}
  private handleConnect(err: Error, cnn: Connection) {
    if (err) {
      cnn.close();
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
        if (!this.metadata_sent) {
          this.push({ main_source: this.main_config });
          this.metadata_sent = true;
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
