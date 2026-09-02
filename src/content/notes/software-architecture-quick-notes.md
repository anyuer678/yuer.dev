---
title: "软件架构开发一页A4速记"
date: "2025-07"
type: "learning"
tags: [软件架构, Spring, 速记]
summary: "软件架构开发考试版一页A4速记"
---

🧾 软件架构开发 · 一页A4速记（考试版）


---

🧠 一、整体主线（最重要！）

> 前端 → 请求 → Controller → Service → DAO(MyBatis) → DB → 返回JSON




---

🧱 二、架构基础（CH01）

MVC

M：数据（Model）

V：界面（View）

C：控制（Controller）



👉 作用：分层解耦


---

前后端分离

前端：页面 + JS

后端：API（JSON）



👉 本质：前端调接口


---

框架作用

提高开发效率

降低耦合




---

🔥 三、Spring核心（CH02 + CH03）【必考】

✅ IoC（控制反转）

对象由Spring创建

不用 new

使用：@Component / @Autowired


👉 核心：

> 对象交给容器管理




---

✅ DI（依赖注入）

自动注入依赖对象



---

✅ AOP（面向切面）

不改代码增加功能

用途：日志 / 权限 / 事务


👉 核心：

> 横切关注点抽离




---

🌐 四、Spring MVC（CH04）【必考】

🔁 请求流程（必背）

客户端
→ DispatcherServlet
→ HandlerMapping
→ Controller
→ Model
→ ViewResolver
→ 返回结果


---

📌 常用注解

@Controller

@RequestMapping

@ResponseBody



---

🗄️ 五、Spring Boot + ORM（CH05）

Spring Boot

自动配置

快速开发


ORM

对象 ↔ 数据库




---

🧩 六、MyBatis（CH06）【重点】

Mapper接口

XML写SQL

参数/结果映射


👉 核心：

> Java调用SQL




---

🌍 七、RESTful API（CH07）【必考】

📌 特点

URL表示资源

使用HTTP方法：


方法	作用

GET	查询
POST	新增
PUT	修改
DELETE	删除



---

📌 风格

无状态

JSON传输



---

🔐 八、认证与安全（CH08）

✅ JWT

用于登录认证

无状态

结构：Header + Payload + Signature



---

✅ 跨域

CORS



---

⚙️ 九、前端异步（CH09）

Promise

fetch / axios


👉 本质：

> 异步请求后端API




---

📦 十、前端工程化（CH10）

Node.js + npm

Webpack / Vite

模块化（import/export）



---

⚛️ 十一、前端框架（CH11）

框架	特点

React	虚拟DOM
Vue	响应式
Angular	MVC



---

🚀 十二、前端进阶（CH12）

状态管理（state）

路由（Router）

懒加载



---

🧠 高频简答题模板（直接背）


---

✍️ IoC是什么？

> 控制反转，将对象创建交给Spring容器，通过依赖注入降低耦合。




---

✍️ AOP是什么？

> 面向切面编程，将日志、事务等横切关注点抽离，提高复用性。




---

✍️ MVC是什么？

> 一种分层架构，将系统分为模型、视图、控制器。




---

✍️ RESTful特点？

> 使用HTTP方法，URL表示资源，无状态，数据格式为JSON。




---

✍️ MyBatis优点？

> SQL灵活、易维护、解耦。




---

✍️ JWT作用？

> 用于用户认证，支持无状态登录。




---

⚡ 最后30秒速记（救命用）

> IoC：对象交给Spring
AOP：不改代码加功能
MVC：分层
MyBatis：Java操作SQL
REST：URL就是资源
JWT：无状态认证


