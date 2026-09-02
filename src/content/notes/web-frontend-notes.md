---
title: "Web前端开发速记"
date: "2025-06"
type: "learning"
tags: [前端, HTML, CSS, JavaScript, TypeScript, 框架]
summary: "Web前端开发核心知识点速记，涵盖HTML5、CSS3、JavaScript、TypeScript、前端框架等内容"
---

## HTML5核心

| 知识点 | 核心 |
|--------|------|
| 语义化标签 | `<header>` `<nav>` `<main>` `<article>` `<section>` `<footer>` |
| 表单增强 | `required` `pattern` `placeholder` `date/email/url` 类型 |
| 多媒体 | `<video>` `<audio>` `<canvas>` `<svg>` |
| 本地存储 | localStorage(永久)、sessionStorage(会话) |
| 离线应用 | Service Worker、Application Cache |

---

## CSS3核心

| 知识点 | 核心 |
|--------|------|
| 选择器 | `:nth-child()` `:not()` `::before` `::after` |
| 弹性布局 | `display: flex` + `justify-content` + `align-items` |
| 网格布局 | `display: grid` + `grid-template-columns` |
| 动画 | `transition` 过渡 + `animation` 关键帧 |
| 响应式 | 媒体查询 `@media (max-width: 768px)` |
| 变量 | `--primary: #333;` + `var(--primary)` |

**Flex布局速记：**
| 属性 | 作用 |
|------|------|
| `justify-content` | 主轴对齐（水平） |
| `align-items` | 交叉轴对齐（垂直） |
| `flex-wrap` | 换行 |
| `flex-grow` | 放大比例 |
| `flex-shrink` | 缩小比例 |

---

## JavaScript核心

| 知识点 | 核心 |
|--------|------|
| 数据类型 | 基本：string/number/boolean/null/undefined/symbol/bigint |
| 引用类型 | Object/Array/Function/Date/RegExp |
| 作用域 | 全局作用域/函数作用域/块级作用域(let) |
| 闭包 | 函数 + 其引用的外部变量，可访问外部作用域 |
| 原型链 | `__proto__` → 构造函数.prototype → Object.prototype → null |
| this指向 | 全局/调用者/显式绑定(new/call/apply/bind) |
| Promise | pending→fulfilled/rejected，链式调用 |
| async/await | 语法糖，await等待Promise结果 |
| 事件循环 | 宏任务(setTimeout)→微任务(Promise)→渲染→宏任务 |

**ES6+特性速记：**
| 特性 | 说明 |
|------|------|
| 箭头函数 | `() => {}`，this绑定外层 |
| 解构赋值 | `const {a, b} = obj;` |
| 展开运算符 | `...arr` `[...arr1, ...arr2]` |
| 模板字符串 | `` `${name}` `` |
| 可选链 | `obj?.prop?.method()` |
| 空值合并 | `value ?? 'default'` |

---

## TypeScript核心

| 知识点 | 核心 |
|--------|------|
| 基础类型 | `string` `number` `boolean` `any` `void` `never` |
| 接口 | `interface User { name: string; age: number; }` |
| 类型别名 | `type ID = string | number;` |
| 联合类型 | `string | number` |
| 泛型 | `function id<T>(x: T): T { return x; }` |
| 工具类型 | `Partial<T>` `Required<T>` `Pick<T,K>` `Omit<T,K>` |

---

## 前端框架对比

| 特性 | React | Vue | Angular |
|------|-------|-----|---------|
| 类型 | 库 | 渐进式框架 | 完整框架 |
| 模板 | JSX | HTML模板 | HTML+指令 |
| 状态管理 | Redux/Zustand | Pinia/Vuex | NgRx |
| 路由 | React Router | Vue Router | Angular Router |
| 双向绑定 | 需手动 | v-model | ngModel |
| 学习曲线 | 中 | 低 | 高 |

---

## 核心对比速查表

| 编号 | A | vs | B | 一句话 |
|------|---|----|---|--------|
| 1 | var | let/const | 函数作用域 vs 块级作用域 |
| 2 | == | === | 宽松比较(类型转换) vs 严格比较(不转换) |
| 3 | localStorage | sessionStorage | 永久存储 vs 会话存储 |
| 4 | React | Vue | JSX vs 模板语法 |
| 5 | Flex | Grid | 一维布局 vs 二维布局 |
| 6 | Promise | async/await | 链式调用 vs 同步写法 |

---

**使用建议**：Flex布局、闭包、原型链、事件循环是面试必问，务必理解透彻。
