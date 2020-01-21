/**
 * @file: index.ts
 */

import Router from 'koa-router';
import {health} from '../controllers/health';
import other from './other';
import home from './home';

const router = new Router();

// 健康检查
router.get('/health', health, () => {});

// 首页的路由
router.use('/', home.routes(), () => {});

// Nested router for /render/other
router.use('/other', other.routes(), () => {});

export default router;
