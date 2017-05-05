'use strict';

/**
 * 获取字段列表的中间件
 * Created by yinfxs on 2017/4/18.
 */
const fields = require('../index');

module.exports = {
    middleware: async (ctx, next) => {
        const _pathname = ctx.req._parsedUrl.pathname;
        const _method = ctx.req.method;
        const key = `${_pathname}|${_method.toUpperCase()}`;

        const _query = ctx.query;
        const _cookies = ctx.cookies;
        const _body = ctx.request.body || {};
        const _reponse = { data: {}, errmsg: null, errcode: null };

        const ibird_fields = _query.ibird_fields || _body.ibird_fields;
        if (!ibird_fields) return await next();

        const userid = _cookies.get('IBIRD_USERID') || _cookies.get('IBIRD_UNIONID') || _query.userid || _body.userid;
        const unionid = userid || _query.unionid || _body.unionid;
        try {
            ctx.body = fields.get(key, unionid);
        } catch (e) {
            ctx.body = Object.assign(_reponse, { errmsg: `获取字段列表失败：${e.message}`, errcode: '500' });
        }
    },
    weights: 1000
};