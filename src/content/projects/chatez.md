---
slug: chatez
title: Chatez
subtitle: 个人 AI 工作空间
status: archived
featured: false
date: 2026-05
tech: [React, TypeScript, Tauri, LLM]
tags: [AI, Desktop]
summary: 可配置 Prompt + Skill 的 AI 工作台（v1.14.1）：多角色切换、Skill 技能系统、SSE 流式输出、会话持久化，支持 Web / Windows / Android 三端。
demo: https://anyuer678.github.io/chatez/
github: https://github.com/anyuer678/chatez
order: 3
---

## 项目介绍

日常要频繁切换角色和模型，通用聊天工具不够用——Chatez 就是为此做的
**可配置 Prompt + Skill 的 AI 工作台**（v1.14.1），支持 Web、Windows、Android 三端：
多 Prompt 角色切换、Skill 技能系统、流式输出与会话持久化。
后来做 EvoCode 时，LLM 接入、流式、密钥管理这些经验都从它这儿来。

## 设计目标

- 多 Prompt 角色：面试官、翻译、故事等角色一键切换，支持自定义
- Skill 技能系统：`/sql`、`/explain` 命令触发 + 自动识别，可扩展
- 参数可控：温度、Top-P、频率/存在惩罚、最大 Token 独立调节
- 跨端一致：Web / Windows（Tauri）/ Android（Capacitor）一套 React 代码

## 功能

- 多 Prompt 角色切换（内置 + 自定义创建/编辑）
- Skill 技能系统（命令触发 + 自动识别，自定义 Skill）
- SSE 流式输出、Markdown 渲染与代码高亮
- 多会话管理：自动标题生成、localStorage 持久化
- GenerationPanel：生成参数独立调节
- API 配置：OpenAI / 自定义兼容接口（多模型），密钥管理与导出脱敏
- 浅色/深色主题，快捷键（`Ctrl+,` 设置、`Enter` / `Ctrl+Enter` 发送）

## 架构

React 18 单前端 + 三端适配壳：Windows 走 Tauri 2.x，Android 走 Capacitor，
状态用 Zustand，样式 Tailwind CSS；API 客户端统一封装密钥与流式请求。
演示版（GitHub Pages）刻意禁用 API Key 配置，保证密钥不落静态页面。

## 技术选择

- **React 18 + TypeScript**：组件生态成熟，三端共享逻辑
- **Tauri 2.x**：桌面端比 Electron 更轻，包体与内存占用低
- **Zustand**：轻量状态管理，适合会话/设置这类全局态

## 开发过程

先做 Web 版对话核心（Prompt 切换 + 流式）→ 加 Skill 引擎 →
Tauri 桌面壳 → Capacitor Android 壳 → 安全加固（密钥加密）→ 迭代到 v1.14。

## 挑战与解决

1. 多模型管理与上下文窗口 → GenerationPanel 独立参数 + 会话级上下文管理
2. 密钥安全 → 密钥本地管理、导出脱敏；演示版禁用 API 配置，密钥不落静态页面
3. 三端差异 → 平台能力抽象成壳层，UI 逻辑全部共享

## 未来计划

已归档；相关经验（LLM 接入、流式、密钥管理）转入 EvoCode。

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/chatez)
- [在线预览（演示模式）](https://anyuer678.github.io/chatez/)
