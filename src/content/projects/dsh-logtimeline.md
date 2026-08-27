---
slug: dsh-logtimeline
title: DSH LogTimeline
subtitle: DeepSeek Harness 日志查询插件
status: completed
featured: false
date: 2026-08
tech: [Python, LLM, AI]
tags: [日志, 工具, 插件]
summary: LogTimeline 的 DeepSeek Harness 适配版：自然语言时间描述 → 日志过滤 → LLM 归因，打包为 DSH 插件，13 项测试通过。
demo:
github: https://github.com/anyuer678/dsh-logtimeline
order: 16
journey: [{"date": "2026-08", "title": "完成", "desc": "LogTimeline 核心功能适配为 DSH 插件，13 项测试通过"}]
---

## 项目介绍

Coding Agent 经常需要回答 "昨天下午 3 点左右发生了什么？"。通用日志工具要手写 grep 管道和时间戳运算。`dsh-logtimeline` 把 LogTimeline 的自然语言时间解析 + 日志过滤能力包装为 DeepSeek Harness 插件，让 Agent 直接调用。

## 设计目标

- **自然语言驱动**：直接描述时间，不用记时间戳格式
- **本地优先**：零第三方 Python 依赖，日志内容不出本机
- **结构化输出**：返回标准 JSON（time_range / filter / lines / stats），Agent 可直接消费

## 功能

- 中文时间解析：绝对日期、相对时间（3 小时前）、模糊窗口（下午）、时间范围
- 多格式日志：自动检测时间戳格式，UTF-8/GBK 编码回退
- 流式过滤：不加载全文件，~2.4s 处理 30 万行
- 级别统计：ERROR/WARN/INFO 分级计数
- 离线模式：不配 LLM 也能用，纯本地统计

## 架构

```
Agent 调用 log_query(时间描述, 日志路径)
  │
  ▼
中文时间解析 → 时间范围 + 置信度
  │
  ▼
日志流式过滤（编码自动检测）
  │
  ▼
结构化 JSON 输出（匹配行 + 级别统计）
  │
  ▼（可选）
LLM 归因分析
```

## 技术选择

- **Python 标准库**：零第三方依赖，部署零成本
- **复用 LogTimeline 核心**：自然语言时间解析引擎直接复用
- **DSH 插件规范**：按 DeepSeek Harness 的 skill 格式打包

## 开发过程

先完成 LogTimeline 核心功能（自然语言时间解析 + 日志过滤），再按 DSH 插件规范封装：注册 `log_query` 工具、适配输入输出格式、编写 13 项测试。

## 挑战与解决

1. 编码兼容 → UTF-8 严格试读失败自动回退 GBK
2. 大文件性能 → 流式逐行处理，不加载全文件到内存
3. DSH 集成 → 按插件规范注册工具接口，输入输出 JSON 化

## 未来计划

- 更多日志格式适配
- 与 DSH 工作流深度集成

## 源码

- [GitHub](https://github.com/anyuer678/dsh-logtimeline)
