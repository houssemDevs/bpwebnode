import { Context } from 'koa';
import SimpleSSE from '../utils/sse';

<<<<<<< HEAD
<<<<<<< HEAD
const sseMiddleware = async (ctx: Context, next: any) => {
=======
export default (log: boolean = true, closeEvent: string = 'closeSSE') => async (
  ctx: Context,
  next: any,
) => {
>>>>>>> d41b141d6caa0c8d70d5e773d3f66d5d73b1e24c
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
  const sse = new SimpleSSE(ctx, log, '', closeEvent);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};
<<<<<<< HEAD
<<<<<<< HEAD

export default sseMiddleware;
=======
>>>>>>> 235faf419d44987fdd4d1e53a74e29c19613829f
=======
>>>>>>> d41b141d6caa0c8d70d5e773d3f66d5d73b1e24c
