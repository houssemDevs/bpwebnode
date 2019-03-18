import SSEStream from '@/utils/ssestream';
import { Context } from 'koa';

interface IsseOpts {
  log: boolean;
  closeEvent: string;
}

const defaultOpts: IsseOpts = {
  log: false,
  closeEvent: 'SSEEnd',
};

export default (options: IsseOpts = defaultOpts) => async (ctx: Context, next: any) => {
  if (ctx.headerSent) {
    console.log(`Cannot set server sent event headers. headers already sent.`);
    await next();
    return;
  }
  const sse = new SSEStream(ctx, options.log, options.closeEvent);
  ctx.sse = sse;
  await next();
  ctx.body = sse;
};
