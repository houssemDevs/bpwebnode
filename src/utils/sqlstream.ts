import { Readable, ReadableOptions } from 'stream';
import { ColumnValue, Connection, ConnectionConfig, Request } from 'tedious';

/**
 * Execute a query using tedious then, stream the results
 * as objects, one object per record.
 * Example:
 *  const allusers = new SqlStream('select * from users', config);
 *  allusers.pipe(jsonifier).pipe(process.stdout)
 *
 * @export
 * @class SqlStream
 * @extends {Readable}
 */
export default class SqlStream extends Readable {
  /**
   * Creates an instance of SqlStream.
   * @param {string} query the SQL query to execute.
   * @param {ConnectionConfig} config Tedious connection config object.
   * @param {ReadableOptions} [options] Readable stream objects.
   * @memberof SqlStream
   */
  constructor(query: string, config: ConnectionConfig, options?: ReadableOptions) {
    super({ ...options, objectMode: true });
    const connection = new Connection(config);
    connection.on('connect', err => {
      if (err) {
        this.emit('error', err);
        this.push(null);
        connection.close();
        return;
      }
      const request = new Request(query, error => {
        if (error) {
          this.emit('error', error);
        }
        this.push(null);
        connection.close();
        return;
      });

      request.on('row', (cols: ColumnValue[]) => {
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

      connection.execSql(request);
    });
  }
  // tslint:disable-next-line: no-empty
  public _read() {}
}
