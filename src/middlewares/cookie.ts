import { Context } from 'koa';

interface ICookies {
  [s: string]: any;
}

export default (cookies: ICookies) => async (ctx: Context, next: any) => {
  Object.entries(cookies).forEach(cookie => {
    if (!ctx.cookies.get(cookie[0])) {
      ctx.cookies.set(cookie[0], cookie[1]);
    }
  });
  await next();
};
