import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IStreamReduxResult } from './types';

/**
 * Reduce an SqlStreamWithFallback data, and produce
 * a single object of type IStreamReduxResult.
 *
 * @export
 * @class SqlStreamWithFallbackReduce
 * @extends {Transform}
 */
export default class SqlStreamWithFallbackReduce extends Transform {
  private collection: IStreamReduxResult;
  private metadata_recived: boolean;

  /**
   * Creates an instance of SqlStreamWithFallbackReduce.
   * @param {TransformOptions} [options] Transform stream options.
   * @memberof SqlStreamWithFallbackReduce
   */
  constructor(options?: TransformOptions) {
    super({ ...options, objectMode: true });
    this.metadata_recived = false;
    this.collection = { main_source: false, list: [] };
  }
  public _transform(buffer: any, encoding: string, done: TransformCallback) {
    if (!this.metadata_recived) {
      this.collection = { ...buffer };
      this.metadata_recived = true;
      return done();
    }
    this.collection.list.push(buffer);
    return done();
  }
  public _flush(done: TransformCallback) {
    this.push(this.collection);
    done();
  }
}
