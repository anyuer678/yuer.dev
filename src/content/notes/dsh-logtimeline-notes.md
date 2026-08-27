---
title: DSH LogTimeline 适配记录
date: 2026-08
tags: [AI, 日志, Python]
summary: 把 LogTimeline 的自然语言时间解析 + 日志过滤能力包装为 DeepSeek Harness 插件，复用核心逻辑，13 项测试通过。
---

## 背景

LogTimeline 做了"自然语言时间 → 日志过滤 → LLM 归因"的链路，但它是独立 CLI 工具。DeepSeek Harness（dsh）的 Agent 也需要这个能力，而且 dsh 的工具调用走标准协议，需要适配。

## 做了什么

把 LogTimeline 核心功能按 DSH 插件规范封装：注册 `log_query` 工具，输入输出 JSON 化，13 项测试通过。

## 关键点

- **复用核心**：自然语言时间解析引擎直接复用 LogTimeline，不重复造轮子
- **DSH 插件规范**：按目录结构和工具注册约定打包，Agent 通过 `read_skill` 加载
- **结构化输出**：返回标准 JSON（`time_range` / `filter` / `lines` / `stats`），Agent 可直接消费
- **编码兼容**：UTF-8 严格试读失败自动回退 GBK，大文件流式处理不加载全文件
- **离线模式**：零第三方 Python 依赖，不配 LLM 也能用

## 现状

已完成适配，13 项测试通过。本质是 LogTimeline 的 DSH 适配层，不是独立项目。

## 待补充

- 更多日志格式适配
- 与 DSH 工作流深度集成
