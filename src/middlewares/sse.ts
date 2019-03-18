import { Context } from 'koa';
import SimpleSSE from '../utils/sse';

<<<<<<< HEAD
const sseMiddleware = async (ctx: Context, next: any) => {
  if (ctx.headerSent) {
    console.log(`Cannot set event stream headers. headers already sent.`);
=======
export default async (ctx: Context, next: any) => {
  if (ctx.headerSent) {
    console.log(`[SSE]: header already sent, could not set SSE`);
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
    await next();
    return;
  }
  const sse = new SimpleSSE(ctx);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};
<<<<<<< HEAD

export default sseMiddleware;
=======
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
