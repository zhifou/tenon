/**
 * @author: packjs
 * @file: app.ts
 */
import Koa from 'koa';
import koaStatic from 'koa-static';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import router from './routes';
import response from './middlewares/response';
import log from './utils/log';
import path from "path";

// Create Koa server
const app = new Koa();

// Koa configuration
// Json limit
app.use(bodyParser({jsonLimit: '10mb', formLimit: '10mb'}));

app.use(cors({
    origin: function(ctx) { // 设置允许来自指定域名请求
        if (ctx.url === '/test') {
            return '*'; // 允许来自所有域名请求
        }
        return 'http://localhost:8080'; // 只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] // 设置获取其他自定义字段
}));

// 配置session的中间件
app.keys = ['12345678abcdefgh'];   /** cookie的签名 */
const CONFIG = {
        key: 'yingxing:sess',       /** 默认 */
        maxAge: 10 * 60 * 1000,     /**  cookie的过期时间10分钟 */
        overwrite: true,            /** (boolean) can overwrite or not (default true)    没有效果，默认 */
        httpOnly: true,             /**  true表示只有服务器端可以获取cookie */
        signed: true,               /** 默认 签名 */
        rolling: true,              /** 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false） 【需要修改】 */
        renew: true,               /** (boolean) renew session when session is nearly expired      【需要修改】*/
    };
app.use(session(CONFIG, app));

// 设置静态资源读取
app.use(koaStatic(path.join(__dirname, '/static/dist')));

// response handler
app.use(response());

// Router handler
app.use(router.routes());
app.use(router.allowedMethods());

// App error handler
app.on('error', (err, ctx) => {
    log.error({ctx, message: `${JSON.stringify(err)}`});
});

export default app;
