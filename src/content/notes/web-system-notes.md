---
title: Web 系统与技术
date: 2025-06
tags: [Web, Java, Servlet, MVC]
summary: Web 系统与技术课程复习：HTTP 协议、Servlet/JSP、MVC 模式、AJAX、jQuery、过滤器/监听器、Maven、JSON 全链路。
---

## 背景

大二下学期 Web 系统与技术课程，从 HTTP 协议到 Java Web 全栈：Servlet → JSP → MVC → AJAX → jQuery → 过滤器/监听器。期末复习整理的速记笔记。

## 关键内容

### HTTP 与 Web 基础

- 互联网是基础设施，Web 是其上的一项服务（HTTP/HTML/URL/浏览器）
- Web 1.0（只读）→ 2.0（可读可写）→ 3.0（去中心化）
- B/S 架构：请求 → Web 服务器（Nginx/Apache）→ 应用程序 → 响应
- HTTP 7 种方法：GET / POST / PUT / DELETE / HEAD / OPTIONS / TRACE

### Servlet 与 JSP

- Servlet：服务器端 Java 程序，处理 HTTP 请求；生命周期 init(1次) → service(每次) → destroy(1次)
- JSP：在 HTML 中嵌入 Java 代码；隐式对象 pageContext / request / session / application / out
- 转发（forward）vs 重定向（redirect）：地址栏变不变、request 对象是否共享

### MVC 模式

- Model（数据）→ View（展示）→ Controller（调度），核心是解耦
- EL 表达式：`${requestScope.变量}` 精确指定作用域
- JSTL：减少 JSP 脚本代码，提高可读性

### AJAX 与 jQuery

- AJAX：异步 JS + XML，核心对象 XHR，实现局部刷新
- jQuery：`$(function(){})` 就绪；`$.ajax()` / `$.get()` / `$.post()` / `$.getJSON()`
- DOM：浏览器生成的 HTML 节点树，JS 通过 DOM 操作页面

### 过滤器与监听器

- Filter：实现 Filter 接口 → 重写 doFilter()（filterChain.doFilter() 放行）；用途：认证 / 编码 / 统计
- 监听器：ServletContextListener（应用启停）、HttpSessionListener（在线人数）

### Maven 与 JSON

- Maven：依赖管理与构建工具；POM 三要素 groupId / artifactId / version
- 依赖范围：provided（容器提供）/ compile（默认）/ test（仅测试）
- JSON：键值对双引号，`JSON.parse()` 字符串→对象，`JSON.stringify()` 对象→字符串

### CSS/JS 速记

- CSS 权重：内联(1000) > ID(100) > 类(10) > 标签(1)
- JS 变量：var（提升+函数域）vs let/const（块级域，无提升）
- 原型链：实例.__proto__ → 构造函数.prototype → Object.prototype → null

## 来源

- 课程复习笔记：`D:\大二上及下的备份\Web\期末复习\WebReview.md`
- 补充速记：`D:\大二上及下的备份\Web\web笔记\补充速记.txt` + `再补.txt`
