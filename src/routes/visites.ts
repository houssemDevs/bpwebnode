import fs from 'fs';
import path from 'path';
import qs from 'querystring';

import koarouter from 'koa-router';

import SqlStream from '../../utils/sqlstream';
import JSONArrayStream from '../../utils/jsonifier';
import { dbconfig } from '../../config';

import qfile from './visites.sql';

const query = fs.readFileSync(path.resolve(__dirname, qfile), { encoding: 'utf-8' });

const router = new koarouter({ prefix: '/visites' });

router.get('/', async ctx => {
  console.log(ctx.query);
  ctx.type = 'application/json';
  ctx.body = new SqlStream(query.replace('$WHERE', ''), dbconfig).pipe(new JSONArrayStream());
});

router.get('/agence/:ag', async ctx => {
  const { ag } = ctx.params;
  const { annee, a } = ctx.query;
  const today = new Date();
  const whereClause = a
    ? `WHERE Agence = '${ag}' AND Date < DATEFROMPARTS(${today.getFullYear()},${today.getMonth() +
        2},1) AND Date >= DATEFROMPARTS(${today.getFullYear()},${today.getMonth() + 1},1)`
    : annee
    ? `WHERE Agence = '${ag}' AND Date <= DATEFROMPARTS(${annee},12,31) AND Date >= DATEFROMPARTS(${annee},1,1)`
    : `WHERE Agence = '${ag}'`;

  ctx.type = 'application/json';
  ctx.body = new SqlStream(query.replace('$WHERE', whereClause), dbconfig).pipe(new JSONArrayStream());
});

router.get('/annee/:an', async ctx => {
  const { an } = ctx.params;
  const { agence } = ctx.query;
  const whereClause = agence
    ? `WHERE Date <= DATEFROMPARTS(${an},12,31) AND Date >= DATEFROMPARTS(${an},1,1) AND Agence = '${agence}'`
    : `WHERE Date <= DATEFROMPARTS(${an},12,31) AND Date >= DATEFROMPARTS(${an},1,1)`;

  ctx.type = 'application/json';
  ctx.body = new SqlStream(query.replace('$WHERE', whereClause), dbconfig).pipe(new JSONArrayStream());
});

export default router;
