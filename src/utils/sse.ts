import { Context } from 'koa';
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
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            "Connection": 'keep-alive',
        });
        this.ctx.req.socket.setTimeout(0);
        this.ctx.req.socket.setKeepAlive(true);
        this.ctx.req.socket.setNoDelay(true);
    }
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
    }
    public _transform(data: any, encoding: string, done: () => void) {
        let subject: any;
        const resp = [];
        const prefix = 'data: ';

        if (isString(data)) {
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
    }
}
