import { Transform, TransformCallback, TransformOptions } from 'stream';

interface ICollection {
  main_source: boolean;
  list: any[];
}

export default class SqlStreamWithFallbackReduce extends Transform {
  private collection: any;
  private first_payload: boolean;
  constructor(options?: TransformOptions) {
    super({ ...options, objectMode: true });
    this.first_payload = true;
    this.collection = {};
  }
  public _transform(buffer: any, encoding: string, done: TransformCallback) {
    if (this.first_payload) {
      this.collection = { ...buffer };
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
