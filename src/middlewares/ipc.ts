import { Context } from 'koa';
import ipc from 'node-ipc';

let count = 0;

export default (appspace: string = `app${count}`, silent: boolean = true) => async (
  ctx: Context,
  next: any
) => {
  if (!ctx.state.id) {
    ctx.state.id = `${ctx.ip}#${Date.now()}#${String(count++).padStart(10)}`;
  }
  ipc.config.id = ctx.state.id;
  ipc.config.appspace = appspace;
  ipc.config.silent = silent;

  ipc.serve();

  ctx.ipc = { server: ipc.server, appspace };

  ipc.server.start();

  await next();
};
