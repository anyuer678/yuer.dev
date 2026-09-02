---
slug: jpetstore-ssm-cms
title: JPetStore SSM 重构
subtitle: SSM PetStore CMS（团队项目）
status: completed
featured: false
date: 2026-05
tech: [Java, Spring Boot, MySQL, MyBatis]
tags: [SSM, 团队项目, 后台管理]
summary: 软件开发架构平台课程实验：8 人团队把 JPetStore 重构为 Spring MVC + MyBatis-Plus，并开发三大后台模块；负责用户模块 API 与前端商品模块。
demo:
github: https://github.com/anyuer678/-SSM-PetStore-CMS-
order: 21
cover: projects/jpetstore-ssm-cms.svg
related: [jpetstore-ssm-notes]
journey: [{"date": "2026-05", "title": "完成", "desc": "SSM 重构 + 后台管理系统，8 人团队协作"}]
---

## 项目介绍

《软件开发架构平台》课程实验一：用 SSM 框架重构 JPetStore 宠物商店，并开发一个后台管理系统（CMS）。团队 8 人，核心任务：① 把原 JSP/Servlet 版 JPetStore 重构为 Spring MVC + MyBatis；② 设计开发商城后台管理系统。

## 设计目标

- 分层架构：表示层 / 持久层 / 服务层清晰分离
- 统一接口：25 个 RESTful API，统一 `ApiResponse` 响应格式，遵循 HTTP 状态码语义
- 后台鉴权：`@AdminLoginRequired` 注解 + Spring AOP 拦截

## 功能

- 后台鉴权：自定义注解 + Spring AOP MethodInterceptor，未登录重定向登录页
- 持久层：每个表一个 Mapper 接口 + XML 映射文件，`@MapperScan` 自动扫描
- 前端多页应用：catalog / account / order / cart / main 五个入口，Axios 封装 API 服务层
- 验证码：Kaptcha 2.3.2 登录保护

## 架构

```
前端（Webpack 5 多入口 + Axios）
  │ /api 代理（开发）
后端（Spring Boot 2.7.18）
  ├── Spring MVC 表示层（Thymeleaf）
  ├── Spring AOP 鉴权（@AdminLoginRequired）
  └── MyBatis + MyBatis-Plus 持久层（HSQLDB / MySQL）
```

## 技术选择

- **Spring Boot 2.7.18 + Spring MVC + MyBatis-Plus 3.5.3.1**：SSM 经典组合
- **Webpack 5**：多入口、CSS 提取、代码分割、开发代理
- **HSQLDB**：开发期内存数据库，生产切 MySQL

## 开发过程

8 人团队分模块并行：用户/订单/商品/购物车按模块拆解，前后端先定 RESTful API 契约再联调；我负责用户模块 API 设计与开发（与组员A）、前端商品模块（与组员B），其余模块参与测试与文档。

## 挑战与解决

1. 前后端跨域 → Webpack Dev Server 的 proxy 把 `/api` 请求代理到后端 8080，绕开同源策略
2. Session Cookie 传递 → Axios 配 `withCredentials: true` 确保请求带 Cookie
3. 多页面 chunk 配置 → HtmlWebpackPlugin 的 chunks 参数精确控制每个页面加载的 JS，避免多余加载

## 未来计划

- 归档存档：本仓库为最终构建产物与说明的备份存档

## 源码

- [GitHub](https://github.com/anyuer678/-SSM-PetStore-CMS-)
