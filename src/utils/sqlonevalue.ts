import { ColumnValue, Connection, ConnectionConfig, Request } from 'tedious';

// SqlOneValue will make an sql query fetch a single row of data then
// return an object with column names as attributes.

interface IResult {
  [s: string]: any;
}

/**
 * @description make a single row sql query (return one row). Throw error if multiple rows.
 */
export default class SqlOneValue {
  private query: string;
  private cnn: Promise<Connection>;

  /**
   * Creates an instance of SqlOneValue.
   * @param {string} query
   * @param {ConnectionConfig} config
   */
  constructor(query: string, config: ConnectionConfig) {
    config.options = { ...config.options, rowCollectionOnRequestCompletion: true };
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

  /**
   * return a promise which will be resolved if any value is got from query,
   * other wise the promise will be reject if multiple values are returnred.
   * if there was no records an empty object is returned.
   * @returns {Promise<any>}
   */
  public async getValue(): Promise<any> {
    const cnn = await this.cnn;
    const req = new Request(this.query, (err, rowCount, rows: ColumnValue[][]) => {
      if (err) {
        throw err;
      } else if (rowCount > 1) {
        throw new Error('multiple values.');
      } else {
        return rows[0].reduce((obj, v) => ({ ...obj, [v.metadata.colName]: v.value }), {});
      }
    });
    cnn.execSql(req);
  }
}
