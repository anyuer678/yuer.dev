---
slug: logtimeline
title: 日志时间戳模糊查询器
subtitle: LogTimeline
status: development
featured: false
date: 2026-08
tech: [Python, AI, LLM]
tags: [日志, 工具]
summary: 说一句"昨天下午服务器为什么崩了"，自动解析成时间范围去扫日志，再用 LLM 归因；--no-llm 模式完全本地，日志不出本机。
demo:
github: https://github.com/anyuer678/logtimeline
order: 13
related: [logtimeline-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "自然语言时间 → 日志过滤 → LLM 归因链路跑通"}]
---

## 项目介绍

排查日志最麻烦的一步是定位时间范围：日志文件一大坨，手动找崩溃前那几分钟很费劲。CLI 工具 `lq`：输入"昨天下午服务器为什么崩了"这类描述 → 解析出时间范围 → 过滤日志 → 输出排查结论。

## 设计目标

- 自然语言驱动：直接描述时间，不用记时间戳格式
- 本地可控：`--no-llm` / `--dry-run` 完全本地，日志不出本机
- 编码兼容：UTF-8 严格试读失败自动回退 GBK（Windows 中文日志）

## 功能

- 时间解析：自然语言 → RFC3339 时间范围，`--since` 可兜底
- LLM 归因：默认把时间窗口内的日志样本（约 2KB token 量级）发给 OpenAI 兼容 API
- 降级：没配 LLM 或调用失败时自动降级为离线统计，退出码区分归因失败与正常
- Web UI：标准库 http.server 实现，零第三方依赖，只监听 127.0.0.1
- 日志文件只读打开；API Key 只从环境变量读，不写盘

## 架构

```
自然语言描述 → 时间解析 → 日志过滤（编码自动检测）→ LLM 归因 / 离线统计
```

## 技术选择

- **Python**：标准库 + 可选 OpenAI 兼容客户端，依赖极简

## 未来计划

- 更多时间表达方式的解析准确率
- 日志格式适配（目前靠通用模式）

## 源码

- [GitHub](https://github.com/anyuer678/logtimeline)
