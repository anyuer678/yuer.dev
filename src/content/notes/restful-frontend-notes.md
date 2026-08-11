---
title: RESTful API 与前端工程化速记
date: 2026-06-20
type: learning
tags: [RESTful, JavaScript, 前端工程化, 课程笔记]
summary: 软件开发架构平台课程的前后端笔记：RESTful 设计原则、JWT 认证鉴权、ES6 语法、模块化构建与前端框架选型，基于老师课件整理。
---

## RESTful API

- 资源通过 URL 定位，动词用 HTTP 方法表达（GET/POST/PUT/DELETE）
- 状态码语义化：`200 OK / 201 Created / 204 No Content / 400 参数错误 / 401 未认证 / 403 无权限 / 404 不存在 / 500 服务器错`
- 常用命名：`/api/v1/users`、分页 `?page=1&size=20`、排序 `?sort=createTime,desc`

## 认证与鉴权：JWT

JWT = JSON Web Token，三部分 `Header.Payload.Signature`。

流程：登录成功 → 服务端签发 token → 前端保存（localStorage/sessionStorage）→ 每次请求带 `Authorization: Bearer {token}` → 服务端验签。无状态、跨域友好。

传统 Session（服务端存会话）+ Redis 共享 vs JWT（客户端存 token）——JWT 的优势是不占服务端内存，代价是吊销难。

## ES6 核心语法

- `let/const`：块级作用域，const 声明不可变绑定
- 箭头函数：无自身 `this`（继承外层），不能做构造函数
- 模板字符串：`\`${name}\``
- 解构赋值：`const { a, b } = obj`
- 展开/剩余：`...arr`
- 模块：`import / export`
- Promise：`resolve/reject → then/catch/finally`；`async/await` 是语法糖
- `Map/Set`：`size / get / set / has / delete`
- 解构赋值陷阱：`{ a = 1 }` 只在 `undefined` 时生效，`null` 会报错

## 模块化与构建

演进：`CommonJS（Node）→ AMD（RequireJS，浏览器）→ ES Module（浏览器原生）→ Vite/Webpack 构建`。

Vite：开发用原生 ES Module + 按需编译，构建用 Rollup；开发时秒级启动。Webpack：模块打包器，loader 处理非 JS 资源、plugin 做优化。

构建工具对比：Vite（快、现代浏览器）vs Webpack（生态成熟、兼容老浏览器）。

## 前端框架选型

Vue 3：组合式 API（`setup / ref / reactive / computed / watch`）+ 响应式基于 Proxy。React：虚拟 DOM + 函数组件 + Hooks。都做数据驱动视图，差异在响应式实现与组件写法。

前后端分离开发模式：前端 mock / 代理转发，联调看 `Network` 面板的请求与状态码。

## 部署注意

SPA 部署到静态服务器：历史路由（History 模式）需要把未知路径重定向到 `index.html`（否则深链刷新 404）；hash 模式则无此问题。
