import koarouter from 'koa-router';

import visites from './visites';

const router = new koarouter({ prefix: '/ctrlcht' });

// visites chantier
router.use(visites.routes());
router.use(visites.allowedMethods());

// console.log(router);
export default router;
