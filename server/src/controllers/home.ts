/**
 * @file other
 * @author zhaoyadong
 */

import Koa from 'koa';
import fs from 'fs';
import path from 'path';
import {mock} from '../decorators/mock';
import {MOCK_TEST} from '../mocks/test.mock';
import {PAGE_BASEPATH} from '../utils/config';

import logger from '../utils/log';
import {STOKEN} from "../utils/cookie";

class Home {

    constructor() {
        // 需要将this对象，bind进来，否则在方法中找不到this对象，或者方法实现使用箭头函数，this也指向当前类
        this.index = this.index.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    @mock(MOCK_TEST)
    private _getBNS(): any {
        return {bns: 'aaaaaa'};
    }

    /**
     * 首页入口
     * @param ctx
     * @param next
     */
    public async index(ctx: Koa.Context, next: Function) {

        let filePath = path.join(__dirname, PAGE_BASEPATH, 'index.html');
        console.log(filePath);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath);
            let contentStr: string = content.toString();
            let user = JSON.stringify(ctx._user);
            // 注入当前用户信息
            contentStr = contentStr.replace('<script id="serverData"></script>',
                `<script id="serverData">
                            window.__tenon__={};
                            window.__tenon__.user=${user};
                         </script>`);
            ctx.body = contentStr;
        } else {
            ctx.body = '<!DOCTYPE html>\n' +
                '<html lang="en" style="font-size: 100px;">\n' +
                '<head>\n' +
                '    <meta charset="utf-8">\n' +
                '    <title>test</title>\n' +
                '    <meta name="viewport"\n' +
                '          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, user-scalable=no, viewport-fit=cover">\n' +
                '    <meta http-equiv="content-type" content="text/html; charset=utf-8">\n' +
                '    <style>' +
                '       html {' +
                '           height: 100%;' +
                '       }' +
                '       body {' +
                '           height: 100%;' +
                '       }' +
                '       #root {' +
                '           display: flex;' +
                '           justify-content: center;' +
                '           align-items: center;' +
                '           width: 100%;' +
                '           height: 100%;' +
                '       }' +
                '       img {' +
                '           color: #666666;' +
                '           width: 80px;' +
                '           height: 80px;' +
                '       }' +
                '       span {' +
                '           padding-left: 20px;' +
                '           font-size: 32px;' +
                '       }' +
                '    </style>\n' +
                '    <script id="serverData"></script>\n' +
                '</head>\n' +
                '<body>\n' +
                '<div id="root"><img src="http://www.abcstatic.com/images/svg/geosearch.svg"/><span>404, 地球上没有找到资源哦！</span></div>\n' +
                '</body>\n' +
                '</html>\n';
        }

        await next();
    }

    /**
     * 系统登人
     * @param ctx
     * @param next
     */
    public async login(ctx: Koa.Context, next: Function) {
        console.log(this);
        const result = this._getBNS();
        console.log(result);
        ctx.success(result);

        await next();
    }

    /**
     * 系统登出
     * @param ctx
     * @param next
     */
    public async logout(ctx: Koa.Context, next: Function) {
        // 删除SToken的cookie
        ctx.cookies.set(STOKEN.key, '', {
            maxAge: 0,
            path: '/'
        });

        // 清除用户登录session
        ctx.session.user = null;

        await next();
    }

}

export default new Home();
