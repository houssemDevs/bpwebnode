import { Readable, ReadableOptions } from 'stream';
import { Connection, ConnectionConfig, Request } from 'tedious';

export default class SqlStream extends Readable {
  private firstRecord: boolean;
  constructor(query: string, config: ConnectionConfig, options?: ReadableOptions) {
    super({ ...options, objectMode: true });
    this.firstRecord = true;
    const connection = new Connection(config);
    connection.on('connect', err => {
      if (err) {
        this.emit('error', err);
        this.push(null);
        connection.close();
        return;
      }
// tslint:disable-next-line: no-shadowed-variable
      const request = new Request(query, err => {
        if (err) {
          this.emit('error', err);
        }
        this.push(null);
        connection.close();
        return;
      });

      request.on('row', cols => {
        if (this.firstRecord) {
          this.firstRecord = false;
          this.push(cols.map(col => col.metadata.colName));
        }
        this.push(cols.map(col => col.value));
      });

      connection.execSql(request);
    });
  }
// tslint:disable-next-line: no-empty
  public _read() {}
}
