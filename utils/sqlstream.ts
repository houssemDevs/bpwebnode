import { Readable, ReadableOptions } from 'stream';
import { Connection, ConnectionConfig, Request } from 'tedious';

export default class SqlStream extends Readable {
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
        const tmpRecord: any = {};
        cols.forEach(col => (tmpRecord[col.metadata.colName] = col.value));
        this.push(tmpRecord);
      });

      connection.execSql(request);
    });
  }
// tslint:disable-next-line: no-empty
  public _read() {}
}
