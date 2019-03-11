import { Context } from 'koa';
import SimpleSSE from '../utils/sse';

export default async (ctx: Context, next: any) => {
  if (ctx.headerSent) {
    console.log(`[SSE]: header already sent, could not set SSE`);
    await next();
    return;
  }
  const sse = new SimpleSSE(ctx);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};
