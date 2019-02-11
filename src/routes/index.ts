import koarouter from 'koa-router';

const router = new koarouter();

router.get('/', async ctx => {
  ctx.body = 'welcome';
});
// TODO: add routes here

export default router;
