import koa from 'koa';
import koalogger from 'koa-logger-middleware';
import koapassport from 'koa-passport';

import router from './routes';
import './services/passport';

const server = new koa();

server.use(koalogger());
server.use(koapassport.initialize());

server.use(router.routes());
server.use(router.allowedMethods());

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`my service on ${port} ...`));
