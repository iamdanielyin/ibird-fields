'use strict';

/**
 * 主模块
 * Created by yinfxs on 2017/4/7.
 */

const raml = require('ibird-raml');
const utility = require('ibird-utils');
const app = {};

module.exports = app;

const cache = { fields: {}, users: {} };

/**
 * 字段初始化配置
 * @param config ibird的配置对象
 * @param obj 自定义配置
 */
app.config = (config, obj) => {
    if (typeof config !== 'object' && typeof obj !== 'object') return;

    const result = {};
    if (!obj) {
        const apis = {};
        raml.modelApis(apis, config);
        raml.routeApis(apis, config);

        const types = raml.modelTypes(config);
        for (const uri in apis) {
            const obj = apis[uri];
            if (!uri || typeof obj !== 'object') continue;
            Object.assign(result, methods(types, uri, obj));
        }
    } else {
        Object.assign(result, obj);
    }
    cache.fields = result;
    return result;
};
/**
 * 用户接口初始化配置
 * @param obj 配置对象
 */
app.users = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.assign(cache.users, obj);
};

/**
 * 获取字段列表
 * @param key 接口地址+请求方式
 * @param unionid 用户ID
 */
app.get = (uri, unionid) => {
    if (typeof cache.fields !== 'object') return {};
    if (!unionid) return cache.fields[uri];
    if (typeof cache.users !== 'object' || typeof cache.users[unionid] !== 'object') return {};

    const _user = cache.users[unionid][uri];
    const _fields = cache.fields[uri];

    if (!Array.isArray(_user) || typeof _fields !== 'object') return {};

    const result = {};
    for (const key in _fields) {
        if (_user.indexOf(key) < 0) continue;
        result[key] = _fields[key];
    }
    return result;
};


/**
 * 遍历每一个服务接口的不同请求方式
 * @param types
 * @param uri
 * @param obj
 * @returns {Array}
 */
const methods = (types, uri, obj) => {
    const result = {};

    for (let method in obj) {
        if (!method) continue;
        const conf = obj[method];
        method = method.toUpperCase();
        const code = `${uri}|${method.toUpperCase()}`;
        const object = {};
        if (method !== 'GET') {
            const query = conf.queryParameters;
            const body = conf.body;
            if (query) {
                let properties = null;
                if (query.type) {
                    properties = query.properties ? query.properties : (types[query.type] ? types[query.type].properties : properties);
                } else {
                    properties = query;
                }
                utility.assign(object, app.fields(properties));
            }
            if (body) {
                let properties = null;
                if (body.type) {
                    properties = body.properties ? body.properties : (types[body.type] ? types[body.type].properties : properties);
                } else {
                    properties = body;
                }
                utility.assign(object, app.fields(properties));
            }
        } else {
            let body = utility.value(conf, 'responses', '200', 'body', 'properties', 'data') || {};
            body = body.properties || body;
            body = body.list && body.list.items && body.totalrecords && body.totalpages ? body.list.items : body;
            if (body) {
                let properties = null;
                let type = body.type;
                if (type) {
                    properties = types[type] ? types[type].properties : properties;
                    properties = body.properties ? Object.assign(properties, body.properties) : properties;
                } else {
                    properties = body;
                }
                utility.assign(object, app.fields(properties));
            }
        }
        result[code] = object;
    }
    return result;
};

/**
 * 根据RAML的字段列表转换成服务接口的字段列表
 * @param fields
 * @returns {Array}
 */
app.fields = (fields) => {
    const result = {};
    if (!fields) return result;
    for (const key in fields) {
        const field = fields[key];
        field.code = key;
        result[field.code] = field;
    }
    return result;
};

