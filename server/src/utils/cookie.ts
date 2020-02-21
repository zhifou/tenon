/**
 * @file cookie配置管理
 * @author packjs
 */

// 登录后的sToken
export const STOKEN = {
    key: 'S_TOKEN',
    options: {
        domain: '',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // expires: new Date(),
        httpOnly: true,
        overwrite: false
    }
};
