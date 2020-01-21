/**
 * @file config.ts
 */

import config from 'config';
import {TResponse} from '../types/index';

export const HEALTH_PATH: string = config.get('path.health');
export const ERRORS: TResponse['message'] = config.get('response.errors');
export const PAGE_BASEPATH: string = config.get('path.pageBasePath');
