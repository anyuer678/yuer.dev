---
slug: codetutor-cn
title: 中文代码教学器
subtitle: Code Tutor CN
status: development
featured: false
date: 2026-08
tech: [JavaScript, AI, LLM]
tags: [教学, AI]
summary: 贴一段代码，像老师一样按水平逐步讲"这段代码在干什么、为什么这么写"，还能出练习题；纯静态单页零依赖，按年龄段分级词汇。
demo:
github: https://github.com/anyuer678/codetutor-cn
order: 11
cover: projects/codetutor-cn.svg
related: [codetutor-cn-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "五步教学流程 + 年龄分级词汇表，纯静态单页可用"}]
---

## 项目介绍

网上讲代码的资料要么太浅、要么太深。想做一个工具：贴一段代码进去，它按你的水平，像老师一样分块讲清楚，再出题验证。纯静态单页，本地双击 index.html 即用。

## 设计目标

- 分层教学：先讲整体在做什么，再分块细讲，最后出题验证
- 年龄分级：幼儿园 / 小学生 / 初中生 / 成人四档词汇表
- 隐私优先：粘贴的代码只在本机浏览器内存处理，不落盘
- 零依赖：纯静态单页，无框架无构建

## 功能

- 五步教学流程：① 这段代码在做什么 → ② 分块讲解（按语义块 3-8 块，每块可"重新讲得更简单"）→ ③ 关键词汇表 → ④ 3 道选择题（答案先隐藏）→ ⑤ 改写挑战
- 年龄分级词汇：中途切换会用新词表重新生成讲解
- 快捷键：Ctrl+Enter 开始讲解；内置"填示例"演示
- 可选代理：`server.py` 解决浏览器直调部分 API 的 CORS 问题

## 架构

```
index.html（纯静态）
  ├── prompts.js   词表 + 角色卡 + JSON 契约
  ├── storage.js   localStorage 只存偏好，不存代码
  ├── llm.js       网络唯一出口：请求/超时/契约校验/容错重试
  ├── state.js     五步状态机
  └── ui.js        renderStep 纯函数
```

## 技术选择

- **原生 JavaScript**：零框架零依赖，任何静态服务器可部署
- **LLM 接口**：OpenAI 兼容协议，JSON 契约约束输出格式

## 开发过程

先定五步教学流程与 JSON 契约，再按模块拆分实现：prompts（词表/角色卡）、llm（唯一网络出口）、state（状态机）、ui（纯函数渲染）。测试用 pytest + node 内置测试器，零第三方依赖。

## 挑战与解决

1. 浏览器直调部分 API 会 CORS 失败 → 提供可选 `server.py` 代理，key 从环境变量读、不出现在前端
2. 隐私 → 粘贴的代码只在浏览器内存处理，localStorage 只存偏好不存代码
3. 讲解超时 → 超 30 秒提示重试，README 明确列出已知限制

## 未来计划

- 更多语种的代码讲解
- 讲解历史记录

## 源码

- [GitHub](https://github.com/anyuer678/codetutor-cn)
