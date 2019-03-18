import { Context } from 'koa';
import SimpleSSE from '@utils/sse';

interface IsseOpts {
  log: boolean;
  closeEvent: string;
}

const defaultOpts: IsseOpts = {
  log: false,
  closeEvent: 'SSEEnd'
}

export default (options: IsseOpts = defaultOpts) => async (
  ctx: Context,
  next: any,
) => {
  if (ctx.headerSent) {
    console.log(`Cannot set server sent event headers. headers already sent.`);
    await next();
    return;
  }
  const sse = new SimpleSSE(ctx, options.log, options.closeEvent);
  ctx.sse = sse;
  ctx.body = sse;
  await next();
};
