import { Context } from 'koa';
import SimpleSSE from '../utils/sse';

const sseMiddleware = async (ctx: Context, next: any) => {
  if (ctx.headerSent) {
    console.log(`Cannot set event stream headers. headers already sent.`);
    await next();
    return;
  }
  const sse = new SimpleSSE(ctx);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};

export default sseMiddleware;
