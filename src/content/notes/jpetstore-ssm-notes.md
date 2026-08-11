---
title: JPetStore SSM 重构与后台管理系统（团队项目笔记）
date: 2026-05
type: project
tags: [Spring Boot, MyBatis, Spring MVC, Webpack, 团队项目]
summary: 软件开发架构平台实验：8 人团队把 JPetStore 重构为 Spring MVC + MyBatis-Plus，并开发三大后台模块。我负责用户模块 API 与前端商品模块。
---

## 项目介绍

《软件开发架构平台》课程实验一：用 SSM 框架重构 JPetStore 宠物商店，并开发一个后台管理系统（CMS）。团队 8 人：徐昱隆、何宇航、吴宗翰、冯正源、王仕汪、洪子枫、林良耀、张振宇。核心是两个任务：① 把原 JSP/Servlet 版 JPetStore 重构为 Spring MVC + MyBatis；② 设计开发商城后台管理系统。

## 技术栈

- 基础框架 Spring Boot 2.7.18，表示层 Spring MVC + Thymeleaf
- 持久层 MyBatis + MyBatis-Plus 3.5.3.1（分页插件）
- 数据库 HSQLDB 内存数据库，Maven 构建，JDK 17
- 验证码 Kaptcha 2.3.2；Spring AOP + AspectJ 做登录鉴权
- 前端 Webpack 5 脚手架：多入口、CSS 提取、代码分割、开发代理

## 核心设计

**后台鉴权**：自定义 `@AdminLoginRequired` 注解 + Spring AOP MethodInterceptor，匹配标注方法做登录拦截，未登录重定向登录页。

**持久层**：每个表一个 Mapper 接口 + 一个 XML 映射文件，`@MapperScan` 自动扫描。核心表：category、product、item、inventory、account、orders、orderstatus、lineitem、admin_signon、cart、user_log。

**RESTful API**：设计 25 个接口，统一 `ApiResponse`（泛型）响应格式，遵循 HTTP 状态码（200 成功 / 400 参数错误 / 401 未认证 / 404 资源不存在）。

**前端**：五个多页应用入口（catalog/account/order/cart/main），Axios 封装 API 服务层（统一拦截器），CSS 变量主题 + 卡片组件。

## 我在团队里的分工

| 模块 | 分工 |
|---|---|
| 用户模块 API（AccountRestController） | 设计与开发（与吴宗翰） |
| RESTful API 设计 | 测试（与吴宗翰） |
| 订单模块 API | 测试（与吴宗翰） |
| 前端商品模块（catalog） | 设计与开发（与张振宇） |
| 前端购物车模块（cart） | 测试（与张振宇） |
| 集成测试与文档 | 全体成员 |

## 踩过的坑

- **前后端跨域**：Webpack Dev Server 的 proxy 把 `/api` 请求代理到后端 8080，绕开同源策略
- **Session Cookie 传递**：Axios 配 `withCredentials: true` 确保请求带 Cookie
- **多页面 chunk 配置**：HtmlWebpackPlugin 的 chunks 参数精确控制每个页面加载的 JS，避免多余加载

## 我的收获

- 第一次完整跑通"API 设计 → 后端实现 → 前端对接"的链路，理解了 REST 资源命名和状态码语义
- Webpack 多入口工程化配置对原生 JS 项目很实用
- 前后端分离模式下，接口文档就是契约，字段对不上联调就卡住
