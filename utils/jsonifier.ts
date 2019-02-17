import { Transform, TransformOptions } from 'stream';

export default class JSONArrayStream extends Transform {
  private firstObj: boolean;
  constructor(options?: TransformOptions) {
    super({ ...options, objectMode: true });
    this.firstObj = true;
  }
  _transform(buffer: any, encoding: string, done) {
    if (this.firstObj) {
      this.firstObj = false;
      this.push(`[${JSON.stringify(buffer)}`);
      return done();
    }
    this.push(`,${JSON.stringify(buffer)}`);
    return done();
  }
  _flush(done) {
    this.push(']');
    done();
  }
}
