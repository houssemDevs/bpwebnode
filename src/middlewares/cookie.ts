import { Context } from 'koa';

interface ICookies {
  [s: string]: any;
}

export default (cookies: ICookies) => async (ctx: Context, next: any) => {
  let needRedirect = false;
  Object.entries(cookies).forEach(cookie => {
    if (!ctx.cookies.get(cookie[0])) {
      needRedirect = true;
      ctx.cookies.set(cookie[0], cookie[1]);
    }
  });
  if (needRedirect) {
    ctx.status = 302;
    ctx.response.set({ Localtion: ctx.url });
    ctx.body = '';
    return;
  }
  await next();
};
