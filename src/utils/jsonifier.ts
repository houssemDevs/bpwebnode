import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class JSONArrayStream extends Transform {
  private firstObj: boolean;
  constructor(options?: TransformOptions) {
    super({ ...options, objectMode: true });
    this.firstObj = true;
  }
  public _transform(buffer: any, encoding: string, done: TransformCallback) {
    if (this.firstObj) {
      this.firstObj = false;
      this.push(`[${JSON.stringify(buffer)}`);
      return done();
    }
    this.push(`,${JSON.stringify(buffer)}`);
    return done();
  }
  public _flush(done: TransformCallback) {
    this.push(']');
    done();
  }
}
