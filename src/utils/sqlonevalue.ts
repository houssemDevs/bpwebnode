import { ColumnValue, Connection, ConnectionConfig, ConnectionOptions, Request } from 'tedious';

interface IResult {
  [s:string]: any;
}

export default class SqlOneValue {
  private query: string;
  private cnn: Promise<Connection>;
  constructor(query: string, config: ConnectionConfig) {
    config.options = {...config.options, rowCollectionOnRequestCompletion: true };
    this.query = query;
    this.cnn = new Promise((res, rej) => {
      const conn = new Connection(config);
      conn.on('connect', err => {
        if (err) {
          rej(err);
        } else {
          res(conn);
        }
      });
    });
  }

  public getValue(): Promise<IResult> {
    return new Promise((res, rej) => {
      this.cnn.then(c => {
        const req = new Request(this.query, (err, rowCount, rows: ColumnValue[]) => {
          if (err) {
            rej(err);
          } else if (rowCount <= 0) {
            rej(new Error('no value found.'));
          } else if (rowCount > 1) {
            rej(new Error('multiple values.'));
          } else {
            res(rows.map(col => ({[col.metadata.colName]: col.value})).reduce((obj,v)=>({...obj, ...v}),{}));
          }
        });
        c.execSql(req);
      });
    });
  }
}
