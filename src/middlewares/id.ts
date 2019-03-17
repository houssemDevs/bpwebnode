import { Context } from 'koa';
import uuid from 'uuid/v4';

export default async (ctx: Context, next: any) => {
  ctx.state.id = uuid();
  await next();
};
