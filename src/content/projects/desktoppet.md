---
slug: desktoppet
title: Desktoppet
subtitle: Extensible Desktop Pet Platform
status: completed
featured: false
date: 2026-08
tech: [Electron, TypeScript]
tags: [Desktop]
summary: 桌面宠物：Electron 桌宠 v1.0，支持事件记录、统计报表、角色包与推送 API。
demo:
github: https://github.com/anyuer678/desktoppet
order: 4
---

## 项目介绍

想让桌面不只是工作区，于是做了 Desktoppet——一个可扩展的桌面宠物平台。
核心思路是 **角色 = 资源包**：桌宠引擎与角色完全解耦，用户可导入自制角色，
桌宠会根据系统状态与事件产生不同表现，会说话、有心情。

## 设计目标

- 角色与引擎解耦：角色做成资源包（.pet），不写代码也能换形象
- 状态驱动表现：桌宠行为由事件中心决策，而不是写死动画
- 本地优先：数据全在本地，支持陪伴统计与自动化接入

## 功能

- 桌宠本体：透明置顶悬浮、呼吸/浮动动画、点击穿透、多显示器、多角色切换
- 状态系统：idle / focus / sleep / happy / warning，由事件中心决策驱动
- 事件中心：可插拔数据源（系统监控 / 剪贴板 / 前台应用 / 插件）
- 剪贴板拟人化互动：复制链接/代码/长文时按特征回应，敏感内容绝不进入 IPC
- 陪伴统计：时长 / 状态分布 / 热力图 / 周报月报 / 年度导出
- 日程提醒与事件推送 API：本地 HTTP `POST /api/event`（Bearer 认证）
- 控制中心：角色 / 台词池 / 日程 / 统计 / 推送 / 事件等 10 个页签

## 架构

Electron 主进程（窗口/角色/事件中心/数据源/监控/统计/日程/推送/存储）
+ preload 白名单 API 桥（contextIsolation + sandbox）
+ 渲染进程（桌宠窗口 + 控制中心两个 React 应用），跨进程契约放 shared/。

## 技术选择

- **Electron**：桌面应用最快落地的跨平台壳，托盘/置顶/透明窗口能力成熟
- **TypeScript**：严格模式贯穿主进程与渲染进程，IPC 契约可类型化

## 开发过程

v0.1 先跑通桌宠本体与角色包 → v0.2 事件中心 → v0.5 陪伴统计 →
v0.8 推送 API → v0.9 剪贴板互动 → v1.0 事件通知页正式版。
全程零运行时新依赖，450 例单测保障。

## 挑战与解决

1. 角色包加载 → config.json 驱动 + 缺素材自动回退，市场可安装/升级
2. 敏感内容泄露风险 → 敏感数据（token/密码/卡号）原文绝不进入 IPC
3. 跨平台托盘交互 → 状态徽章与情绪色对应，托盘菜单统一入口

## 未来计划

- 角色包生态持续扩展，计划支持更多动画模板与社区市场

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/desktoppet)
