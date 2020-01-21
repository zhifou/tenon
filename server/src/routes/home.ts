/**
 * @file: home.ts
 */
import Router from 'koa-router';
import home from '../controllers/home';

const router = new Router();
router.get('/', home.index, () => {});
router.get('login', home.login, () => {});
router.get('logout', home.logout, () => {});

export default router;
