import { Context } from 'koa';
import { Transform, TransformOptions } from 'stream';
import { isObject } from 'util';

export default class SimpleSSE extends Transform {
  private ctx: Context;
  private log: boolean;
  private ended: boolean;
  private closeEvent: string;
  constructor(
    ctx: Context,
    log: boolean = false,
    closeEvent: string = 'closeSSE',
    opts?: TransformOptions
  ) {
    super({ ...opts, objectMode: true });
    this.ctx = ctx;
    this.log = log;
    this.ended = false;
    this.closeEvent = closeEvent;
    this.setHeader();
  }
  public send(data: any, encoding?: string, done?: () => void) {
    if (arguments.length === 0 || this.ended) {
      return false;
    }
    super.write(data, encoding, done);
  }
  public end(data: any, encoding?: string, done?: () => {}) {
    if (!data) {
      data = { event: this.closeEvent };
    } else {
      data = { event: this.closeEvent, data };
    }
    this.ended = true;
    super.end(data, encoding, done);
  }
  public _transform(data: any, encoding: string, done: () => void) {
    let subject: any;
    const resp = [];
    const prefix = 'data: ';
    if (!isObject(data)) {
      subject = { data };
    } else {
      subject = data;
    }

    if (subject.event) {
      resp.push(`event: ${subject.event}`);
    }
    if (subject.id) {
      resp.push(`id: ${subject.id}`);
    }
    if (subject.relay) {
      resp.push(`relay: ${subject.relay}`);
    }

    if (isObject(subject.data)) {
      resp.push(`${prefix}${JSON.stringify(subject.data)}`);
    } else {
      resp.push(`${prefix}${subject.data}`);
    }

    // logging here.
    this.push(resp.join('\n').concat('\n\n'));
    done();
  }
  private setHeader() {
    this.ctx.req.socket.setTimeout(0);
    this.ctx.req.socket.setNoDelay(true);
    this.ctx.req.socket.setKeepAlive(true);
    this.ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      "Connection": 'keep-alive',
    });
  }
}
