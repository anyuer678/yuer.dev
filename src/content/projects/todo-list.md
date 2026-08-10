---
slug: todo-list
title: Todo List
subtitle: 轻量个人待办应用
status: completed
featured: false
date: 2026-07
tech: [CSS, JavaScript]
tags: [Tool]
summary: 原生实现的开箱即用待办应用：今日视图 + 收件箱 + 番茄钟，数据本地存储，Web / Windows / Android 三端一套代码。
demo: https://anyuer678.github.io/todo-list/
github: https://github.com/anyuer678/todo-list
order: 6
---

## 项目介绍

一个打开即用的待办应用：集待办管理、番茄钟、统计于一体，数据存在本地，Web、Windows、Android 三端共用一套代码，无框架依赖。

## 设计目标

- 轻量：原生实现，无框架依赖，任意静态服务器可部署
- 多端：Web / Windows / Android 一套代码覆盖
- 顺手：今日视图 + 收件箱 + 星标，快速记录不打断思路

## 功能

- 今日视图（逾期提醒、统计概览）与收件箱快速记录
- 任务管理：优先级、重复任务、星标、批量操作
- 番茄钟专注计时 + 本地通知提醒
- 数据备份 / 恢复，多主题切换（纸纹/风景/水墨）
- Windows 系统托盘快捷操作，响应式适配移动端

## 架构

单页应用（www/）+ Electron 桌面壳 + Capacitor Android 壳；
数据用 localStorage 持久化，主进程只做托盘与通知桥接。

## 技术选择

- **原生 CSS / JS**：无构建链负担，三端共享同一套源码

## 开发过程

先做 Web 版核心（今日视图 + 任务管理）→ 加番茄钟与统计 →
Electron 托盘 → Capacitor 打包 Android → 收尾成最终版。

## 挑战与解决

1. 三端一致 → 前端逻辑与平台壳分离，壳只负责能力补全（通知/托盘）
2. 数据安全 → 备份/恢复功能 + localStorage 容量提示

## 未来计划

- 计划更换全新 UI 与架构，做一次彻底重构

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/todo-list)
