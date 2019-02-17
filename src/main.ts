import koa from 'koa';
import koalogger from 'koa-logger-middleware';

import router from './routes';

const server = new koa();

server.use(koalogger());

server.use(router.routes());
server.use(router.allowedMethods());

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Plan controle service on ${port} ...`));
