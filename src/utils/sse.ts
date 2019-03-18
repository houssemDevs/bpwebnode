import { Context } from 'koa';
<<<<<<< HEAD
import { Transform } from 'stream';
import { isFunction, isObject, isString, isUndefined } from 'util';

export default class SimpleSSE extends Transform {
  private ctx: Context;
  private closeEvent: string;
  private log: boolean;
  private ended: boolean;
  private traceId: string;
  constructor(
    ctx: Context,
    log: boolean = false,
    traceId: string = '',
    closeEvent: string = 'closeSSE',
  ) {
    super({ objectMode: true });
    this.closeEvent = closeEvent;
    this.log = log;
    this.ctx = ctx;
    this.ended = false;
    this.traceId = traceId;
    this.ctx.set({
      'Cache-Control': 'no-cache',
      "Connection": 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
    this.ctx.req.socket.setTimeout(0);
    this.ctx.req.socket.setKeepAlive(true);
    this.ctx.req.socket.setNoDelay(true);
  }

  public end(data: any): void;
  // tslint:disable-next-line:unified-signatures
  public end(data: any, encoding?: string): void;
  public end(data: any, encoding?: string, callback?: () => void): void {
    if (!data && !this.ended) {
      data = { event: this.closeEvent };
    }
    this.ended = true;
    super.end(data, encoding, callback);
  }
  public send(data: any, encoding?: string, callback?: () => void) {
    if (arguments.length === 0 || this.ended) {
      return false;
    }
    super.write(data, encoding, callback);
=======
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
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
  }
  public _transform(data: any, encoding: string, done: () => void) {
    let subject: any;
    const resp = [];
    const prefix = 'data: ';
<<<<<<< HEAD

    if (isString(data)) {
=======
    if (!isObject(data)) {
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
      subject = { data };
    } else {
      subject = data;
    }
<<<<<<< HEAD
=======

>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
    if (subject.event) {
      resp.push(`event: ${subject.event}`);
    }
    if (subject.id) {
      resp.push(`id: ${subject.id}`);
    }
<<<<<<< HEAD

    if (isObject(subject.data)) {
      resp.push(`${prefix}${JSON.stringify(subject.data)}`);
    } else if (isUndefined(subject.data)) {
      resp.push(`${prefix}`);
    } else {
      resp.push(`${prefix}${subject.data}`);
    }
    if (this.log) {
      this._log(`Event sequence - ${resp.join(';')}`);
    }
    this.push(resp.join('\n').concat('\n\n'));
    this.emit('message', resp.join('\n').concat('\n\n'));
    if (this.ctx.body && isFunction(this.ctx.body.flush)) {
      this.ctx.body.flush();
    }
    done();
  }
  private _log(msg: any) {
    console.log(`[SimpleSSE:${this.traceId}]: ${msg}`);
=======
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
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
  }
}
