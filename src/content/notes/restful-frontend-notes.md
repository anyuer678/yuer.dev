---
title: RESTful API 与前端工程化速记
date: 2026-06-20
type: learning
tags: [RESTful, JavaScript, Vue, 前端工程化, 课程笔记]
summary: 软件开发架构平台课程的前后端笔记：REST 六约束、Spring Boot 实现模式、JWT 认证鉴权、ES6 语法、Vue 指令与组件、构建工具与部署，基于老师课件整理。
---

## RESTful API

### REST 的六约束

REST 不只是一个 URL 风格，它背后是一组架构约束：

1. **客户端-服务器**：前端只管展示、后端只管业务，两端独立演化
2. **无状态**：每个请求自带全部信息，服务器不存客户端会话状态，所以天然好横向扩展
3. **缓存**：响应可被缓存，减少服务器负载（配合 HTTP 缓存头）
4. **统一接口**：资源标识、通过表述操作资源、自描述消息
5. **分层系统**：每层只和相邻层通信，可加网关/代理/负载均衡而不影响客户端
6. **按需代码（可选）**：服务器可下发脚本给客户端执行

### 设计要点

- 资源用名词 + 复数定位：`/api/users`、`/api/orders`
- 动词交给 HTTP 方法：GET 查询、POST 创建、PUT 完整更新、PATCH 部分更新、DELETE 删除
- 状态码语义化：`200 OK / 201 Created / 204 No Content / 400 参数错误 / 401 未认证 / 403 无权限 / 404 不存在 / 500 服务器错`
- 分页 `?page=1&size=20`、排序 `?sort=createTime,desc`；请求响应统一 JSON
- 版本管理两种：URL 版本 `/api/v1/users`，或 Header `Accept: application/vnd.example.v1+json`

### Spring Boot 实现模式

课程给的实现链路是四层：`Entity → Repository（JPA）→ Service → Controller`。

- Controller 用 `@RestController` + `@RequestMapping("/api/users")`，方法级 `@GetMapping/@PostMapping/...`
- 创建返回 `201 Created` + `Location` 头指向新资源
- 统一响应封装 `ApiResponse`（code/message/data），`success/error` 静态工厂
- 全局异常处理 `@RestControllerAdvice`：资源不存在 → 404、参数校验失败 → 400、兜底 → 500
- 文档用 springdoc（Swagger UI），`@Tag/@Operation/@Parameter` 注解自动生成接口文档，`/swagger-ui.html` 可交互调试

### 前后端分离的开发流程

1. **API 先行**：需求分析 → API 设计 → API 文档（Swagger）→ 评审
2. **并行开发**：前端用 Mock 数据独立开发页面，后端实现业务 + 自测 API
3. **联调**：前后端对接真实接口，看 Network 面板的请求与状态码定位问题
4. **上线**：前端静态资源 CDN/静态服务器，后端独立部署

## 认证与鉴权：JWT

JWT = JSON Web Token，三部分 `Header.Payload.Signature`。

流程：登录成功 → 服务端签发 token → 前端保存（localStorage/sessionStorage）→ 每次请求带 `Authorization: Bearer {token}` → 服务端验签。无状态、跨域友好。

传统 Session（服务端存会话）+ Redis 共享 vs JWT（客户端存 token）——JWT 的优势是不占服务端内存，代价是吊销难。

## ES6 核心语法

- `let/const`：块级作用域，const 声明不可变绑定
- 箭头函数：无自身 `this`（继承外层），不能做构造函数
- 模板字符串：`` `${name}` ``
- 解构赋值：`const { a, b } = obj`
- 展开/剩余：`...arr`
- 模块：`import / export`
- Promise：`resolve/reject → then/catch/finally`；`async/await` 是语法糖
- `Map/Set`：`size / get / set / has / delete`
- 解构赋值陷阱：`{ a = 1 }` 只在 `undefined` 时生效，`null` 会报错

## Vue 3 速查

### 指令

| 指令 | 用途 |
|---|---|
| `{{ msg }}` / `v-html` | 文本插值 / 渲染原始 HTML（慎用防 XSS） |
| `v-bind`（`:id`） | 动态绑定属性 |
| `v-model` | 表单双向绑定 |
| `v-if / v-else-if / v-else` | 条件渲染（切换代价高） |
| `v-show` | 只切 display（初始渲染代价高） |
| `v-for` | 列表渲染，必须配 `:key` |
| `v-on`（`@click`） | 事件绑定，`@submit.prevent`/`@click.stop` 是修饰符 |

### 组件与通信

- **父传子**：props 声明（最好定义类型）
- **子传父**：`$emit('enlarge-text')`，父组件 `@enlarge-text` 监听
- 生命周期：`created → mounted → updated → unmounted`
- 单文件组件（SFC）：template / script / style scoped 三段式
- 组合式 API：`setup` + `ref/reactive/computed/watch`

### Vuex（状态管理）

`state（数据）→ mutations（同步改状态）→ actions（异步提交 mutation）→ getters（派生数据）`，组件里 `this.$store.state.count` 读、`commit('increment')` 写。

## 模块化与构建

演进：`CommonJS（Node）→ AMD（RequireJS，浏览器）→ ES Module（浏览器原生）→ Vite/Webpack 构建`。

Vite：开发用原生 ES Module + 按需编译，构建用 Rollup；开发时秒级启动。Webpack：模块打包器，loader 处理非 JS 资源、plugin 做优化。

构建工具对比：Vite（快、现代浏览器）vs Webpack（生态成熟、兼容老浏览器）。

## 前端框架选型

Vue 3：组合式 API（`setup / ref / reactive / computed / watch`）+ 响应式基于 Proxy。React：虚拟 DOM + 函数组件 + Hooks。都做数据驱动视图，差异在响应式实现与组件写法。

## 部署注意

SPA 部署到静态服务器：历史路由（History 模式）需要把未知路径重定向到 `index.html`（否则深链刷新 404）；hash 模式则无此问题。
