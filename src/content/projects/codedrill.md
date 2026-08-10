---
slug: codedrill
title: CodeDrill
subtitle: 离线代码训练平台
status: completed
featured: true
date: 2026-07
tech: [Vue 3, Vite, Electron, JavaScript]
tags: [Learning]
summary: 离线编程训练系统：代码临摹、代码填空、错误修复三种模式，支持 7 种语言与 22 套浅色主题，覆盖 Web / Windows / Android 三端。
demo: https://anyuer678.github.io/codedrill/
github: https://github.com/anyuer678/codedrill
order: 2
---

## 项目介绍

离线编程训练系统：练习不依赖在线判题服务，本地即可完成。提供代码临摹、代码填空、错误修复三种训练模式，覆盖 Java、Python、C++ 等 7 种语言。

## 设计目标

- 不依赖网络：题目与答案都在本地，随时可练
- 训练为主：临摹、填空、改错，而不是从零空写
- 三端覆盖：Web、Windows、Android 共用一套代码

## 功能

- 三种训练模式：代码临摹、代码填空、错误修复
- 7 种语言：Java / Python / C++ / JavaScript / TypeScript / Linux Shell / SQL
- 训练模块：循环、条件、数组、字符串、函数
- 22 套浅色主题：纯色、渐变、纸纹、水墨
- 成就系统、技能树、遗忘曲线复习

## 架构

Vue 3 + Pinia 单页应用，练习逻辑与状态管理集中在前端；Windows 端用 Electron 打包，Android 端用 Capacitor，三端共用同一套 Web 代码。

## 技术选择

- **Vue 3 + Pinia**：无需后端，状态与题目数据全部在前端管理
- **Electron / Capacitor**：同一套代码覆盖桌面与移动端，只换打包层

## 开发过程

先做核心训练引擎（题目数据与三种模式）→ 主题系统 → 三端打包 → 收尾。

## 挑战与解决

1. 离线可用 → 题目、答案、判分逻辑全部在本地，不依赖网络
2. 三端复用 → 核心逻辑与 UI 完全共用，Electron 与 Capacitor 只负责打包

## 未来计划

- 已满足学习目标，转入维护模式（archived 候选）

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/codedrill)
