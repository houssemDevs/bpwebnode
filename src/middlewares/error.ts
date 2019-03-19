import { Context } from 'koa';

export default async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next();
  } catch (err) {
    console.log(err.message);
    ctx.status = 500;
    ctx.body = 'Something gone wrong in our server, we are working on it.';
  }
};
