import { Context } from 'koa';
import SimpleSSE from '../utils/sse';

export default (log: boolean = true, closeEvent: string = 'closeSSE') => async (
  ctx: Context,
  next: any,
) => {
  if (ctx.headerSent) {
    console.log(`Cannot set event stream headers. headers already sent.`);
    await next();
    return;
  }
  const sse = new SimpleSSE(ctx, log, '', closeEvent);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};
