# 字段模块

> 模块代码：ibird-fields

该模块主要用于辅助管理后台模块（[ibird-admin](/ibird-admin.md)）模块做表格列生成和表单字段生成。

## 安装模块

```js
npm i ibird-fields -S
```

## 引用模块

```js
const fields = require('ibird-fields');
```

## 返回结构

```js
// 结构示例
{
    "/api/v1/org|GET": {
        "code": {
            "type": "string",
            "required": true,
            "displayName": "机构编码",
            "code": "code"
        },
        "name": {
            "type": "string",
            "required": true,
            "displayName": "机构名称",
            "code": "name"
        },
        "type": {
            "type": "number",
            "required": true,
            "displayName": "机构类型",
            "code": "type"
        },
        "_org": {
            "type": "Org",
            "required": false,
            "displayName": "所属机构",
            "code": "_org"
        },
        "_creator": {
            "type": "User",
            "required": false,
            "displayName": "创建人",
            "code": "_creator"
        },
        "_modifier": {
            "type": "User",
            "required": false,
            "displayName": "修改人",
            "code": "_modifier"
        },
        "_created": {
            "type": "number",
            "required": false,
            "displayName": "创建时间",
            "code": "_created"
        },
        "_modified": {
            "type": "number",
            "required": false,
            "displayName": "修改时间",
            "code": "_modified"
        },
        "_dr": {
            "type": "boolean",
            "required": false,
            "default": false,
            "displayName": "删除标记",
            "code": "_dr"
        },
        "_remark": {
            "type": "string",
            "required": false,
            "displayName": "备注",
            "code": "_remark"
        },
        "_id": {
            "displayName": "数据ID",
            "description": "默认生成的ID字段",
            "type": "string",
            "required": true,
            "example": "58ff71aeed56765aff6ea878",
            "code": "_id"
        },
        "__v": {
            "displayName": "版本",
            "description": "默认生成的版本字段",
            "type": "integer",
            "required": true,
            "default": 0,
            "example": 0,
            "code": "__v"
        }
    },
    "/api/v1/org|POST": {
        "code": {
            "type": "string",
            "required": true,
            "displayName": "机构编码",
            "code": "code"
        },
        "name": {
            "type": "string",
            "required": true,
            "displayName": "机构名称",
            "code": "name"
        },
        "type": {
            "type": "number",
            "required": true,
            "displayName": "机构类型",
            "code": "type"
        },
        "_org": {
            "type": "Org",
            "required": false,
            "displayName": "所属机构",
            "code": "_org"
        },
        "_creator": {
            "type": "User",
            "required": false,
            "displayName": "创建人",
            "code": "_creator"
        },
        "_modifier": {
            "type": "User",
            "required": false,
            "displayName": "修改人",
            "code": "_modifier"
        },
        "_created": {
            "type": "number",
            "required": false,
            "displayName": "创建时间",
            "code": "_created"
        },
        "_modified": {
            "type": "number",
            "required": false,
            "displayName": "修改时间",
            "code": "_modified"
        },
        "_dr": {
            "type": "boolean",
            "required": false,
            "default": false,
            "displayName": "删除标记",
            "code": "_dr"
        },
        "_remark": {
            "type": "string",
            "required": false,
            "displayName": "备注",
            "code": "_remark"
        },
        "_id": {
            "displayName": "数据ID",
            "description": "默认生成的ID字段",
            "type": "string",
            "required": true,
            "example": "58ff71aeed56765aff6ea878",
            "code": "_id"
        },
        "__v": {
            "displayName": "版本",
            "description": "默认生成的版本字段",
            "type": "integer",
            "required": true,
            "default": 0,
            "example": 0,
            "code": "__v"
        }
    }
};
```

> Tips：字段列表是一个以服务编码为key的对象类型。

## 内部接口

* fields.config：配置系统内所有的字段列表，也可以通过ibird配置对象直接生成，也可以通过自定义配置生成
* fields.users：自定义配置不同用户的字段列表
* fields.get：根据接口编码获取字段列表

### 配置字段列表

```js
// 传入ibird配置对象
const app = require('ibird-core');
fields.config(app.config());

// 自定义配置字段列表
fields.config(null, obj);// obj即为自定义配置对象，格式参考上面返回皆可
```

### 自定义用户配置

如果需要设置不同用户所看到的字段不同，可以通过接口对用户进行设置：

```js
// 定义不同用户的可见字段编码，最外层为用户ID，里面是接口地址+请求方式组成的key（请求方式大写）
// 最里面是字段列表数组，指定字段编码即可
const config = {
    "zhangsan": {
        "/api/v1/org|GET": [
            "code",
            "name"
        ],
        "/api/v1/order|GET": [
            "orderno",
            "state"
        ]
    },
    "lisi": {
        "/api/v1/org|GET": [
            "code",
            "name",
            "age"
        ],
        "/api/v1/order|GET": [
            "orderno",
            "state"
        ]
    }
};
// 注入用户配置
fields.users(config);
```

### 获取字段列表

```js
const array = fields.get(key, unionid);
```

其中key是接口编码，由接口地址+请求方式组成（如"/api/v1/org\|GET"）；unionid是用户ID，该参数可选，如果不传递，则直接返回全部字段列表。

## 内置中间件

服务模块提供一个内置中间件，开发者挂载该中间件后，调用对应接口时，传递一个参数即可获取字段列表：

```js
// 导出内置字段路由
const get = require('ibird-fields/middleware/get');

// 可以直接挂载到ibird中
const app = require('ibird-core');
app.config().middleware.push(get);

// 也可以自行挂载到koa中
app.use(get.middleware);
```

挂载好之后，如需获取接口对应的字段列表，只需要在调用对应接口时，指定参数`ibird\_fields`等于`1`即可。
