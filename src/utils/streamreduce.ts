import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class StreamReduce extends Transform {
  private collection: any[];
  constructor(options?: TransformOptions) {
    super({ ...options, objectMode: true });
    this.collection = [];
  }
  public _transform(buffer: any, encoding: string, done: TransformCallback) {
    this.collection.push(buffer);
    return done();
  }
  public _flush(done: TransformCallback) {
    this.push(this.collection);
    done();
  }
}
